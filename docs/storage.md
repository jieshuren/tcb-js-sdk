## 存储

<!-- TOC -->autoauto- [存储](#存储)auto    - [上传文件](#上传文件)auto    - [获取文件下载链接](#获取文件下载链接)auto    - [删除文件](#删除文件)auto    - [下载文件](#下载文件)autoauto<!-- /TOC -->

### 上传文件

uploadFile(object)

请求参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| cloudPath | string | 是 | 文件的绝对路径，包含文件名。例如foo/bar.jpg、foo/bar/baz.jpg等，不能包含除[0-9 , a-z , A-Z]、/、!、-、_、.、、*和中文以外的字符，使用 / 字符来实现类似传统文件系统的层级结构。[查看详情](https://cloud.tencent.com/document/product/436/13324)
| filePath | HTML upload file | 是 | 要上传的文件对象

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileID | fileID | 是 | 文件唯一ID，用来访问文件，建议存储起来
| requestId | string | 否 | 请求序列号，用于错误排查

示例代码

```javascript
let result = await app.uploadFile({
    cloudPath: "test-admin.jpeg",
    filePath: document.getElementById('file').files[0]
});
```

### 获取文件下载链接

getTempFileURL(object)

请求参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileList | &lt;Array&gt;.string | 是 | 要下载的文件ID组成的数组

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileID | string | 是 | 文件ID
| maxAge | Integer | 是 | 文件链接有效期

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则为SUCCESS
| message | string | 否 | 错误描述
| fileList | &lt;Array&gt;.object | 否 | 存储下载链接的数组
| requestId | string | 否 | 请求序列号，用于错误排查

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 删除结果，成功为SUCCESS
| fileID | string | 是 | 文件ID
| tempFileURL | string | 是 | 文件访问链接

示例代码

```javascript
let result = await app.getTempFileURL({
    fileList: ['cloud://test-28farb/a.png']
});
```

### 删除文件

deletfile(object)

请求参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileList | &lt;Array&gt;.string | 是 | 要删除的文件ID组成的数组

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileList | &lt;Array&gt;.object | 否 | 删除结果组成的数组
| requestId | string | 否 | 请求序列号，用于错误排查

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 删除结果，成功为SUCCESS
| fileID | string | 是 | 文件ID

示例代码

```javascript
let result = await app.deleteFile({
    fileList: [
        "HHOeahVQ0fRTDsums4GVgMCsF6CE3wb7kmIkZbX+yilTJE4NPSQQW5EYks"
    ]
});
```

### 下载文件

downloadFile(object)

请求参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileID | string | 是 | 要下载的文件的id
| tempFilePath | string | 否 | 下载的文件要存储的位置

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileContent | Buffer | 否 | 下载的文件的内容。如果传入tempFilePath则不返回该字段
| requestId | string | 否 | 请求序列号，用于错误排查

示例代码

```javascript
let result = await tcb.downloadFile({
    fileID: "cloud://aa-99j9f/my-photo.png",
    // tempFilePath: '/tmp/test/storage/my-photo.png'
});
```