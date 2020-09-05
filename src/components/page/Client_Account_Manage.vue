<template>
    <div>
        <!-- 表格主体 -->
        <el-row :gutter="20">
            <div class="handle-box" style="padding-left:20px; padding-bottom:10px; float:left;">
                <el-input v-model="search_id" placeholder="按客户ID搜索" style="width:300px;"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索相关账户</el-button>
                <el-button style="float:right;" type="success" icon="el-icon-circle-plus" @click="handleAdd">新增账户</el-button>
                <el-button style="float:right;" type="info" icon="el-icon-lock" @click="handleAllFreeze">冻结该客户所有账户</el-button>
            </div>
            <el-table :data="tableData" border class="table" 
            ref="multipleTable" header-cell-name="tale-header">
                <el-table-column prop="clientAccount" label="所属客户ID" width="150" align="center"></el-table-column>
                <el-table-column prop="id" label="账户账号" width="400" align="center"></el-table-column>
                <el-table-column prop="freeze" label="账号状态" width="250" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.freeze=== 0 ?'success':(scope.row.freeze=== 1 ?'danger':'')"
                        >
                        <span v-if="scope.row.freeze=='0'">
                            可正常使用
                        </span>
                        <span v-else>已被冻结</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="账号余额" width="285" align="center">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                          type="primary"
                          icon="el-icon-lock" circle
                          @click="handleSingleFreeze(scope.row.freeze,scope.row.id)"></el-button>
                        <el-button
                          type="danger" 
                          icon="el-icon-delete" circle
                          @click="handleDelete(scope.row.id)"></el-button>
                          </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="70px">
                <el-form-item  label="ID">
                    <el-input style="width:220px;" v-model="addForm.id" placeholder="请输入需要新增账户的客户ID"></el-input>
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
            addForm:{},
            addVisible:false,
            deleteVisible : false
        };
    },
    components: {
    },
    computed: {
    },
    methods: {
        // 冻结/解冻操作
        handleSingleFreeze(target_type,target_id) {
            if(target_type == 0){
                service.put(baseUrl+'/freezeById', {
                    id : target_id
                })
                .then(function (response) {
                    if(response.code == '3101'){
                      this.$message.success(`冻结成功`);
                    }else{
                    this.$message.error(`冻结失败，原因：`+response.msg);
                    }}.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
            }else if(target_type == 1){
                service.put(baseUrl+'/unfreezeById', {
                    id : target_id
                })
                .then(function (response) {
                    if(response.code == '3101'){
                      this.$message.success(`解冻成功`);
                    }else{
                    this.$message.error(`解冻失败，原因：`+response.msg);
                    }}.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
            }
            
        },
        handleAllFreeze() {
            service.put(baseUrl+'/freezeByCA', {
                    clientAccount : this.search_id
                })
                .then(function (response) {
                    if(response.code == "3101"){
                    this.addVisible = false;
                    this.$message.success(`冻结成功`);
                }else{
                    this.$message.error(`冻结失败，原因：`+response.msg);
                }}.bind(this))
                .catch(function (error) { 
                    console.log(error);
                });
        },
        // 搜索操作
        handleSearch(){
            if(this.search_id == ''){
                this.$message.error('请输入需要进行管理操作的客户ID！');
            }else{
                service.get(baseUrl+'/account/'+this.search_id, {
                })
                .then(function (response) {
                    var a = response.data;
                    this.tableData = a;
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
            service.post(baseUrl+'/account', {
                    clientAccount : this.addForm.id
            })
            .then(function (response) {
                console.log(response);
                if(response.code == "3201"){
                    this.addVisible = false;
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
            service.delete(baseUrl+'/account/'+account,{
            })
            .then(function (response) {
                if(response.code == "3301"){
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
