# @jzone/cosupload

> tencent-cos的二次封装，可根据入参决定用固定Secret或tmpSecret

## 安装

```bash
# Using yarn
yarn add @jzone/cosupload
# tag
yarn add @jzone/cosupload@1.3.0
# Using npm
npm install @jzone/cosupload
# tag
npm install @jzone/cosupload@1.3.0
```

## 使用

### 固定SecretId、SecretKey

```js
import COS from '@jzone/cosupload'

const UploadFileInstance = new UploadFile({
  SecretId: 'xxx',
  SecretKey: 'xxx',
  Bucket: 'xxx',
  Region: 'xxx',
  defaultBasePath: '', // 次级目录 默认年/月/日
})

UploadFileInstance.upload({
  file: 'test', // 文件或字符串
  basePath: '', // 顶级目录
  success: data => console.warn(data)
})

```

### 临时SecretId、SecretKey

```js
import COS from '@jzone/cosupload'

const UploadFileInstance = new UploadFile({
  Bucket: 'xxx',
  Region: 'xxx',
  defaultBasePath: '', // 次级目录 默认年/月/日
  tmpSecretUrl: 'xxx', // 获取tmpSecret相关信息的接口，接口返回结构{ data:{credentials, expiredTime } } })

UploadFileInstance.upload({
  file: 'test', // 文件或字符串
  basePath: '', // 顶级目录
  success: data => console.warn(data)
})

```

## 发布

```bash
 # base
 yarn prod

 # tag
 yarn prod tag
```
