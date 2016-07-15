# Lu Hybrid

![Lu icon](https://static.lufaxcdn.com/wcm-images/sWx838-6VBJ5gW9SRnJojg.gif)

## 简介

**Lu Hybrid**, 陆金所移动部门 *Hybrid* 项目.运用了HTML5，React，Flux，ES2015等一系列技术,提供通用而高效的开发体验，因为历史问题，此项目的根目录包含了`html5-framework`和`mobile-hybrid-resource`这两个子项目，mobile-hybrid-resource是第一版本Hybrid框架，html5-framework是第二版本Hybrid框架,随后的1年会逐步融合这3大Hybrid框架,演化出一个统一的框架.



## 开始


### 注意

> 注意保持环境一致, `Node js` 请使用**5.3**稳定版本, `Npm`请使用**3.5**以上

### 环境准备

##### 安装nodejs

 请下载nodejs 5.3稳定版本
 
 [下载地址(国外)](https://nodejs.org)  [下载地址(国内)](http://nodejs.cn)



##### 安装cnpm

```shell
$sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
```
##### 安装lnpm
*陆金所基于`cnpm`的内部镜像*

###### *Mac*

如果您使用**`bash`**,append如下脚本到**`.bash_profile`**

如果您使用**`zsh`**,append如下脚本到**`.zshrc`**

###### *Linux*
如果您使用**`bash`**,append如下脚本到**`.bashrc`**

如果您使用**`zsh`**,append如下脚本到**`.zshrc`**

```shell
alias lnpm='cnpm --registry=http://registry.npm.lu-fe.com --registryweb=http://npm.lu-fe.com --cache=~/.npm/.cache/lnpm'

# cnmp alias
alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"
```
#### 升级安装

如果你已经包括老版本的`nodejs`可以参考上面的nodejs安装方法,如果你包括老版本的`npm cnpm` 请用如下命令升级:

```
$sudo npm install -g npm
$sudo npm install -g cnpm
```
确认版本正确:

```bash
$npm -v
$cnpm -v
$lnpm -v
```


### 安装Lu Hybrid

如果你是dirty的环境,那么为了确保安全,请执行如下命令(请确保在hybrid项目根目录):

```
$rm -rf node_modules #如果你有残留的node_modules,才运行此命令
$npm uninstall #卸载本地所有依赖
$sudo npm uninstall xxx -g #卸载全局依赖
$npm cache clean #清除本地缓存

```

这样可以确保你的环境处于干净状态.

如果你的环境干净.参考如下命令:

```
$git clone git@gitlab.lujs.cn:mobile/html5-hybrid.git
$cd html5-hybrid
$lnpm install  #这里可以用cnpm npm 代替
```



#### babel问题

babel6已经不建议全局安装,所以请暂时不要全局安装babel.
 
 
#### 启动
项目启动后,会自动打开浏览器同时打开debug辅助页面.

```shell
$npm start
```

#### React发布命令

```
$npm run build -- --release
```

#### 代码质量检测命令

```
$npm run lint
```

#### csslint

```
$npm run csslint
```

#### 清理build目录

```
$npm run clean
```

#### 复制静态资源到build

```
$npm run copy
```



## 如何打包`html5-framework`

进入项目根目录

```
$sudo npm install uglify-js -g  #全局安装uglify-js
$sudo npm install requirejs -g #全局安装requirejs

```
> * 下载yuicompressor-2.4.8.jar并放到~/develop_tool/目录下
> * 可以[点击下载](http://172.19.21.201:8080/nm.zip)(访问不了可以联系冯超)下载，然后解压到html5-framework下

### 注意事项
 **请注意，因为现在html5-framework的build脚本是基于相对目录，所以首先确保当前目录为项目根目录，并在根目录下执行build命令**
 
遇到“yargs”模块找不到的报错，请执行

``` 
$sudo npm install yargs --save-dev 
```

遇到gulp命令找不到，可以在html5-framework执行

```
$sudo npm install gulp #没有-g安装本地目录版本
```




## 全局Build
进入根目录并运行如下命令：

```bash
sh tools/sh/pack.sh
```

## 分支规范

### pull规范

```
git pull --rebase
```

### 分支策略
借鉴gitflow并演化,因为陆金所特殊业务流程,我们的分支按照,FEA(feature)为前缀表示功能模块,V(version)为前缀表示版本即将发布.

* `FEA_MessageCenter_xxx` 表示xxx号需求是消息中心的需求功能块.

* `V3.1.5` 表示即将发布3.1.5版本,会陆续merge各大FEA分支进入V分支

* `develop` 为了避免新需求突然进来,造成代码落后,develop会包含各类最新代码和架构改造,并以此分支为基准拉最新的FEA分支
* `master` 真正的release分支.REG类tag需要V分支merge到master后打
* Bugfix请必须在V分支进行
* 功能开发在FEA分支进行
* 架构改造在develop进行.或另行开ARC分支
* merge只能用在FEA到V,或者V到develop,V到master.不允许用在其他场景
* V验收完毕同时merge到develop和master.

----------


### **Git Rules**
Comments提交规则:

 - **开发Feature规则**
```
[FEA]JIRAIDXXX:做了什么?需要注意什么?影响有哪些? 
```
举例:
```
[FEA]APP-905:详情页chart开发完成,此提交未使用LUUI控件.
```

 - **Bug Fix规则**
```
[BUG]JIRAIDXXX:修复了什么?需要注意什么?影响有哪些?
```
举例:
```
[BUG]BUG-14176:投资统计中没有私募基金的投资金额和已收款金额Fixed
```

 - **架构改造规则**
```
[ARC]JIRAIDXXX:改造了什么?需要注意什么?影响有哪些?
```
举例:

```
[ARC]APP-1270:NavgationBar Component初始开发完成.文档请参考Samples页面...
```