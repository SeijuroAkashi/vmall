<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row>
          <el-col><el-button type="primary" @click="dialogVisible=true">添加角色</el-button></el-col>
        </el-row>
        <el-table :data="roleList" stripe border>
<!--          展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                      :class="['bdbottom',i1===0?'bdtop':'','vcenter']">
<!--                一级权限-->
                <el-col :span="5">
                 <el-tag closable @close="delRigthsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
<!--                二级和三级权限-->
                <el-col :span="19">
<!--                  通过for循环，循环二级权限 -->
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'bdtop','vcenter']">
<!--                    二级权限-->
                    <el-col :span="6">
                      <el-tag closable @close="delRigthsById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
<!--                    三级权限-->
                    <el-col :span="18">
                      <el-tag @close="delRigthsById(scope.row,item3.id)" closable type="warning" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"
              @click="editDialog(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRolesById(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="30%"
        @close="addDialogClosed">
        <el-form :model="addForm" label-width="70px" ref="addFormRef">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
      </el-dialog>

      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed">
        <el-form :model="editForm" label-width="70px" ref="editFormRef">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesInfo">确 定</el-button>
  </span>
      </el-dialog>

<!--      分配权限对话框-->
      <el-dialog
        @close="setRightsDialogClosed"
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%">
        <el-tree ref="treeRef" default-expand-all :default-checked-keys="defKeys" show-checkbox :data="rightsList" :props="treeProps" node-key="id"></el-tree>
        <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="allotRigths">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      dialogVisible: false,
      editDialogVisible: false,
      delDialogVisible: false,
      // 分配权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 即将分配权限的角色ID
      roleId: '',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {},
      // 所有权限列表
      rightsList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值
      defKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      // 获取所有角色列表
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        this.roleList = res.data
      }
    },
    // 添加角色
    async addRoles () {
      const { data: res } = await this.axios.post('roles', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error('创建角色失败')
      } else {
        this.$message.success('创建角色成功')
        this.dialogVisible = false
        this.getRolesList()
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑角色
    async editDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.axios.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      } else {
        this.editForm = res.data
      }
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async editRolesInfo () {
      const { data: res } = await this.axios.put('roles/' + this.editForm.id, {
        roleName: this.editForm.roleName,
        roleDesc: this.editForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      } else {
        this.$message.success('更新成功')
        this.editDialogVisible = false
        await this.getRolesList()
      }
    },
    // 删除角色
    async delRolesById (id) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.axios.delete('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          await this.getRolesList()
        }
      }
    },
    // 删除权限
    async delRigthsById (role, rightsId) {
      // 弹框提示用户是否删除
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        // 确认了删除
        const { data: res } = await this.axios.delete(`roles/${role.id}/rights/${rightsId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        } else {
          this.$message.success('删除成功')
          role.children = res.data
        }
      }
    },
    // 展示分配权限对话框

    async  showSetRightsDialog (role) {
      this.setRightsDialogVisible = true

      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      } else {
        this.rightsList = res.data

        // 递归获取三级节点的ID
        this.getLeafKeys(role, this.defKeys)
      }
    },

    // 通过递归方式，获取 三级权限 的ID并保存到defKeys数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    // 在分配权限之后，清空之前数组内容
    setRightsDialogClosed () {
      this.defKeys = []
    },

    // 点击 为角色分配权限
    async allotRigths () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配失败')
      } else {
        this.$message.success('分配成功')
        this.getRolesList()
        this.setRightsDialogVisible = false
      }
    }

  }
}
</script>

<style scoped lang="less">
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eeeeee;
}

.bdbottom{
  border-bottom: 1px solid #eeeeee;
}
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
