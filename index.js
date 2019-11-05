import COS from 'cos-js-sdk-v5'
import Api from 'axios'
import dayJs from 'dayjs'
import { randomString } from './utils/index.js'

const instance = Api.create({
  withCredentials: true,
})

/**
 *
 * @author nazi
 * @class UploadFile 腾讯云上传文件类
 * @param {*} SecretId
 * @param {*} SecretKey
 * @param {*} Bucket
 * @param {*} Region
 * @param {*} tmpSecretUrl 获取临时Secret的url, 返回结果为 { data: {credentials, expiredTime } }
 * @param {*} defaultBasePath // 默认年/月/日/
 * @param {bool} returnFileUrl 是否返回文件地址
 *
 * @returns 暴露cos实例，可自行使用
 */
class UploadFile {
  constructor (props) {
    this.config = this.getDefaultProps(props)
    if (this.config.SecretId && this.config.SecretKey) {
      this.init()
    } else {
      this.initTmpCos()
    }
  }

  init () {
    const { SecretId, SecretKey } = this.config
    this.cos = new COS({
      SecretId,
      SecretKey,
    })
  }

  // 获取临时凭证
  initTmpCos () {
    const { tmpSecretUrl } = this.config
    this.cos = new COS({
      async getAuthorization (options, callback) {
        try {
          const { data } = await instance.get(tmpSecretUrl)
          const { credentials, expiredTime } = data.data
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            ExpiredTime: expiredTime,
          })
        } catch (error) {
          throw new Error(error)
        }
      },
    })
  }

  getDefaultProps (props) {
    const { Bucket, Region, defaultBasePath, ...other } = props

    const staticBucketConfig = {
      Bucket,
      Region,
    }

    return {
      defaultBasePath: defaultBasePath || dayJs().format('YYYY/MM/DD'),
      ...other,
      staticBucketConfig,
    }
  }

  /**
 *
 * @author nazi
 * @param {*} file 文件对象
 * @param {*} success 成功的回调函数
 * @param {*} fail 失败的回调函数
 * @returns
 * @memberof UploadFile
 */
  async upload ({ basePath, file, success, fail }) {
    const that = this

    const { defaultBasePath } = this.config

    if (!file) return console.warn('file is undefined')
    // const path = file.name + +(new Date())

    const Key = `${basePath}/${defaultBasePath}/${randomString()}`
    this.cos.putObject({
      ...this.config.staticBucketConfig,
      Key,
      Body: file,
    }, function (err, data) {
      that.handleResult({
        err,
        data: `http://${data.Location}`,
        fail,
        success,
      })
    })
  }

  async getFileUrl ({ Key, success, fail, ...other }) {
    const that = this
    this.cos.getObjectUrl({
      ...this.config.staticBucketConfig,
      Sign: false,
      Key,
      ...other,
    }, function (err, data) {
      that.handleResult({ err, data: data.Url, success, fail })
    })
  }

  async deleteFile ({ Key, success, fail, ...other }) {
    const that = this
    this.cos.deleteObject({
      ...this.config.staticBucketConfig,
      Key,
      ...other,
    }, function (err, data) {
      that.handleResult({ err, data, success, fail })
    })
  }

  async deleteMultipleFile ({ files, success, fail, ...other }) {
    if (!Array.isArray(files)) throw new Error('files is require, The parameter needs to be [{ Key: xxx }]')

    const that = this
    this.cos.deleteMultipleObject({
      ...this.config.staticBucketConfig,
      Objects: files,
      ...other,
    }, function (err, data) {
      that.handleResult({ err, data, success, fail })
    })
  }

  handleResult ({ err, data, success, fail }) {
    if (err) {
      typeof fail === 'function' && fail(err)
      return console.warn(err)
    }
    typeof success === 'function' && success(data)
  }
}

export default UploadFile