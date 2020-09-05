<template>
    <div>
        <!-- 表格主体 -->
        <el-row :gutter="20">
            <div class="handle-box" style="padding-left:20px; padding-bottom:10px; float:left;">
                <el-input v-model="search_id" placeholder="按管理员ID搜索" style="width:300px;"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索管理员</el-button>
                <el-button style="float:right;" type="success" icon="el-icon-circle-plus" @click="handleAdd">新增管理员</el-button>
            </div>
            <el-table :data="tableData" border class="table" 
            ref="multipleTable" header-cell-name="tale-header">
                <el-table-column prop="account" label="管理员ID" width="250" align="center"></el-table-column>
                <el-table-column prop="username" label="姓名" width="250" align="center"></el-table-column>
                <el-table-column prop="perms" label="权限" width="600" align="center">
                    <template slot-scope="scope">
                            <el-tag v-for="item in scope.row.perms" :key="item" type="success" style="margin-right:5px;">
                                <span v-if="item == 'cl_ge'">
                                    查看客户信息
                                </span>
                                <span v-else-if="item == 'cl_up'">修改客户信息</span>
                                <span v-else-if="item == 'cl_ad'">增加客户</span>
                                <span v-else-if="item == 'cl_del'">删除客户</span>
                                <span v-else-if="item == 'ac_ge'">查看账户</span>
                                <span v-else-if="item == 'ac_ad'">增加账户</span>
                                <span v-else-if="item == 'ac_up'">修改账户</span>
                                <span v-else-if="item == 'ac_del'">删除账户</span>
                                <span v-else-if="item == 'ac_fre'">冻结账户</span>
                                <span v-else-if="item == 'ac_unf'">解冻账户</span>
                            </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit" circle
                          @click="handleEdit(scope.row)"></el-button>
                        <el-button
                          type="danger" 
                          icon="el-icon-delete" circle
                          @click="handleDelete(scope.row.account)"></el-button>
                          </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item  label="管理员ID">
                    <el-input style="width:280px;" v-model="form.account" disabled></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-checkbox-group v-model="perms_group" size="medium">
                        <el-checkbox label="cl_ge" ></el-checkbox>
                        <el-checkbox label="cl_up" ></el-checkbox>
                        <el-checkbox label="cl_ad" ></el-checkbox>
                        <el-checkbox label="cl_del" ></el-checkbox>
                        <el-checkbox label="ac_ge"></el-checkbox>
                        <el-checkbox label="ac_ad"></el-checkbox>
                        <el-checkbox label="ac_up"></el-checkbox>
                        <el-checkbox label="ac_del"></el-checkbox>
                        <el-checkbox label="ac_fre"></el-checkbox>
                        <el-checkbox label="ac_unf"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="form" :model="addForm" label-width="70px">
                <el-form-item  label="管理员ID">
                    <el-input style="width:220px;" v-model="addForm.account" placeholder="请输入管理员ID"></el-input>
                </el-form-item>
                <el-form-item  label="密码">
                    <el-input style="width:220px;" v-model="addForm.password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item  label="姓名">
                    <el-input style="width:220px;" v-model="addForm.username" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-checkbox-group v-model="add_perms_group" size="medium">
                        <el-checkbox label="cl_ge" ></el-checkbox>
                        <el-checkbox label="cl_up" ></el-checkbox>
                        <el-checkbox label="cl_ad" ></el-checkbox>
                        <el-checkbox label="cl_del" ></el-checkbox>
                        <el-checkbox label="ac_ge"></el-checkbox>
                        <el-checkbox label="ac_ad"></el-checkbox>
                        <el-checkbox label="ac_up"></el-checkbox>
                        <el-checkbox label="ac_del"></el-checkbox>
                        <el-checkbox label="ac_fre"></el-checkbox>
                        <el-checkbox label="ac_unf"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除弹出框 -->
        <el-dialog title="删除" :visible.sync="deleteVisible" width="30%">
            <h4 >确定要删除<strong>{{ this.deleteAccount }}</strong>吗？</h4>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import baseUrl from '@/api/baseUrl';
import service from '@/utils/request';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
      return {
        account :'',
        username:'',
        search_id:'',
        tableData: [],
        perms_group:[],
        add_perms_group:[],
        form:{},
        editVisible: false,
        addForm:{},
        addVisible:false,
        deleteAccount:'',
        deleteVisible : false
      };
    },
    components: {
    },
    computed: {
    },
    created() {
         this.getClientData();
    },
    methods: {
        //获取表格信息
        getClientData(){
            service.get(baseUrl+'/users', {
            })
            .then(function (response) {
                var data = response.data;
                this.tableData = data;
                }.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        // 编辑操作
        handleEdit(row) {
            this.form = row;
            this.perms_group = row.perms;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            service.put(baseUrl+'/user', {
                    account: this.form.account,
                    perms: this.perms_group
            })
            .then(function (response) {
                if(response.code == "4101"){
                    this.$message.success(`修改成功`);
                }else{
                    this.$message.error(`修改失败，原因：`+response.msg);
                }}.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        // 搜索操作
        handleSearch(){
            if(this.search_id == ''){
                service.get(baseUrl+'/users', {
                })
                .then(function (response) {
                    var a = response.data;
                    this.tableData = a;
                    }.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
            }else{
                service.get(baseUrl+'/user/'+this.search_id, {
                })
                .then(function (response) {
                    var a = response.data;
                    var b = [a];
                    console.log(b);
                    this.tableData = b;
                    }.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
            }
        },
        // 新增操作
        handleAdd(){
            this.addVisible = true;
        },
        //提交新增
        saveAdd(){
            this.addVisible = false;
            service.post(baseUrl+'/user', {
                    account: this.addForm.account,
                    username : this.addForm.username,
                    password :this.addForm.password,
                    perms :this.add_perms_group
            })
            .then(function (response) {
                if(response.code == "4201"){
                    this.$message.success(`新增成功`);
                }else{
                    this.$message.error(`新增失败，原因：`+response.msg);
                }}.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        // 删除操作
        handleDelete(account){
            this.deleteVisible = true;
            this.deleteAccount = account;
        },
        sureDelete(){
            this.deleteVisible = false;
            service.delete(baseUrl+'/user/'+this.deleteAccount,{
            })
            .then(function (response) {
                if(response.code == "4301"){
                    this.$message.success(`删除成功`);
                }else{
                    this.$message.error(`删除失败，原因：`+response.msg);
                }}.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        }
    }
};
</script>


<style scoped>

.el-checkbox {
    margin-right: 30px;
    margin-bottom : 10px;
}

.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
