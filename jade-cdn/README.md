Jade-CDN
=====================

基本使用
---------------------

### Build

* 构建所有子模块的脚本`bash ./build.sh`
* 构建单个子模块，切换到子目录下，执行`bash ./build.sh`

### 本地测试 

脚本`bash ./run-dev.sh`中指定端口启动HTTP服务。

### 发布生产

打包上传：

```bash
bash deploy-rls.sh
```

登录服务器，执行``bash scripts/deploy-cdn.sh：

```bash
cd /home/nginx/jadecdn/
rm -rf webroot
tar -xvf cdn.tar.gz
rm cdn.tar.gz
```






各个子模块
---------------------

### 3rd(deprecated)

3rd libs.

### 3rd.v2

3rd libs.

* bootstrap
* datatables
* jquery
* jsviews
* showdown
* zTree.v3


### jadeutils(deprecated)

Static files for my personal project.

### jadeutils.v2

Static files for my personal project.

[jadeutils.v2](jadeutils.v2/README.md)


