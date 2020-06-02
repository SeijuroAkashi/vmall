<template>
  <el-container class="home-container">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/a.jpeg" alt="">
        <span>管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    主体区域-->
    <el-container>
      <!--      左侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle_button" @click="toggleTabs">《《《</div>
        <el-menu
          background-color="#333774"
          text-color="#fff"
          active-text-color="#409efe"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class=iconsobj[item.id]></i>
              <span>{{item.authName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNav('/'+subItem.path)">
              <template slot="title">
                <!--                图标-->
                <i class="el-icon-menu"></i>
                {{subItem.authName}}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menulist: [],
      iconsobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.axios.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
      }
    },
    // 点击，切换菜单栏的折叠和展开
    toggleTabs () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNav (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d34;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-sizing: border-box;
      }

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #33377d;

    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle_button {
    background-color: #ccc;
    font-size: 10px;
    line-height: 24px;
    color: #fffdef;
    text-align: center;
    cursor: pointer;
  }
</style>
