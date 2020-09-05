<template>
    <div>
        <!-- 表格主体 -->
        <el-row :gutter="20">
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
                          size="mini"
                          type="primary"
                          @click="getDetail(scope.row.id)">查看流水明细</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 查看流水弹出框 -->
        <el-dialog title="账户流水明细" :visible.sync="detailVisible" width="80%">
            <el-table :data="detailData" v-loading="loading" border class="table" 
            ref="multipleTable" header-cell-name="tale-header">
                <el-table-column prop="accountId" label="交易发起方" width="400" align="center"></el-table-column>
                <el-table-column prop="anoAccountId" label="交易对象方" width="400" align="center"></el-table-column>
                <el-table-column prop="money" label="交易数额(¥)" width="250" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.money > 0 ?'success':(scope.row.money < 0 ?'danger':'')"
                        >
                        {{scope.row.money}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="交易时间" width="285" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="checked">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import baseUrl from '@/api/baseUrl';
import service from '@/utils/request';
export default {
    name: 'dashboard',
    data() {
        return {
            name : '',
            birth :'',
            account :'',
            sex : '',
            tableData: [],
            detailData:[],
            loading: true,
            detailVisible : false,
        };
    },
    components: {
        //
    },
    computed: {
        //role() {
        //    return this.name === 'admin' ? '超级管理员' : '普通用户';
        //}
    },
    created() {
        // this.handleListener();
        // this.changeDate();
         this.getAccountData();
    },
    //activated() {
         //this.handleListener();
    //},
    //deactivated() {
        // window.removeEventListener('resize', this.renderChart);
        // bus.$off('collapse', this.handleBus);
    //},
    methods: {
        //获取表格信息
        getAccountData(){
            //console.log(JSON.parse(localStorage.getItem('login_data')));
            service.get(baseUrl+'/account/'+sessionStorage.getItem('ms_username'), {
            })
            .then(function (response) {
                var obj = response.data;
                this.tableData = obj;
                }.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        //获取账户交易明细
        getDetail(id){
            this.detailVisible = true;
            service.get(baseUrl+'/moneyChanges/'+id, {
            })
            .then(function (response) {
                var data = response.data;
                this.detailData = data;
                this.loading = false;
                }.bind(this))
            .catch(function (error) { 
                console.log(error);
            });
        },
        //确认流水明细、重置明细表
        checked(){
            this.detailVisible = false;
            this.loading = true;
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
