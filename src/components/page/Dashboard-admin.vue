<template>
    <div>
        <!-- 表格主体 -->
        <el-row :gutter="20">
            <div class="handle-box" style="padding-left:20px; padding-bottom:10px; float:left;">
                <el-input v-model="search_id" placeholder="按客户ID搜索" style="width:300px;"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索客户</el-button>
                <el-button style="float:right;" type="success" icon="el-icon-circle-plus" @click="handleAdd">新增客户</el-button>
            </div>
            <el-table :data="tableData" border class="table" 
            ref="multipleTable" header-cell-name="tale-header">
                <el-table-column prop="account" label="客户ID" width="250" align="center"></el-table-column>
                <el-table-column prop="birth" label="生日" width="250" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="250" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" width="250" align="center">
                    <template slot-scope="scope">
                        <i
                            :class="scope.row.sex=== 1 ?'el-icon-male':(scope.row.sex=== 0 ?'el-icon-female':'')"
                        ></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-edit" circle
                          @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <el-button
                          type="danger" 
                          icon="el-icon-delete" circle
                          @click="handleDelete(scope.row.account)"></el-button>
                          </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item  label="姓名">
                    <el-input style="width:220px;" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker
                        v-model="form.birth"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="生日日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="form.sex" label="1">男</el-radio>
                    <el-radio v-model="form.sex" label="0">女</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="70px">
                <el-form-item  label="ID">
                    <el-input style="width:220px;" v-model="addForm.account" placeholder="请输入ID"></el-input>
                </el-form-item>
                <el-form-item  label="密码">
                    <el-input style="width:220px;" v-model="addForm.password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item  label="姓名">
                    <el-input style="width:220px;" maxlength="7" show-word-limit v-model="addForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker
                        v-model="addForm.birth"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择生日日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="addForm.sex" label="1">男</el-radio>
                    <el-radio v-model="addForm.sex" label="0">女</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
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
            name : '',
            birth :'',
            account :'',
            sex : '',
            search_id:'',
            tableData: [],
            form:{},
            editVisible: false,
            addForm:{},
            addVisible:false,
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
            service.get(baseUrl+'/clients', {
            })
            .then(function (response) {
                var data = response.data;
                this.tableData = data;
                }.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            let set_sex = 0;
            if(this.form.sex == 1){
                set_sex = 1;
            }
            service.put(baseUrl+'/client', {
                    account: this.form.account,
                    name: this.form.name,
                    birth: this.form.birth,
                    sex: set_sex
            })
            .then(function (response) {
                if(response.code == "2101"){
                    this.$message.success(`修改成功`);
                    this.$set(this.tableData,this.form);
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
                service.get(baseUrl+'/clients', {
                })
                .then(function (response) {
                    var a = response.data;
                    this.tableData = a;
                    }.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
            }else{
                service.get(baseUrl+'/client/'+this.search_id, {
                })
                .then(function (response) {
                    var a = response.data;
                    var b = [a];
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
            service.post(baseUrl+'/client', {
                    account: this.addForm.account,
                    password :this.addForm.password,
                    name: this.addForm.name,
                    birth: this.addForm.birth,
                    sex: this.addForm.sex
            })
            .then(function (response) {
                if(response.code == "2201"){
                    this.addVisible = false;
                    this.$message.success(`新增成功`);
                    this.tableData += addform;
                }else{
                    this.$message.error(`新增失败，原因：`+response.msg);
                }}.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        // 删除操作
        handleDelete(account){
            service.delete(baseUrl+'/client/'+account,{
            })
            .then(function (response) {
                if(response.code == "2301"){
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
