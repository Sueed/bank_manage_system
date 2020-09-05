<template>
    <div>
        <!-- 表格主体 -->
        <el-row :gutter="20">
            <el-table :data="tableData" border class="table" 
            ref="multipleTable" header-cell-name="tale-header">
                <el-table-column prop="account" label="客户ID" width="250" align="center"></el-table-column>
                <el-table-column prop="birth" label="生日" width="250" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="250" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" width="250" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="primary"
                          @click="handleEdit(scope.$index, scope.row)">编辑个人信息</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 图标部分 -->
        <el-row :gutter="20">
            <el-col :span="12"> 
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
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
                    <el-radio v-model="form.sex" label="男">男</el-radio>
                    <el-radio v-model="form.sex" label="女">女</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import baseUrl from '@/api/baseUrl';
import service from '@/utils/request';
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name : '',
            birth :'',
            account :'',
            sex : '',
            tableData: [],
            form:{},
            editVisible: false,
            options: {
                type: 'bar',
                title: {
                    text: '名下账户支出图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '账户1',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '账户2',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '账户3',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '名下账户收入图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '账户1',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '账户2',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '账户3',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        //role() {
        //    return this.name === 'admin' ? '超级管理员' : '普通用户';
        //}
    },
    created() {
        // this.handleListener();
        // this.changeDate();
         this.getClientData();
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
        getClientData(){
            //console.log(JSON.parse(localStorage.getItem('login_data')));
            var obj = JSON.parse(sessionStorage.getItem('login_data'));
            if(obj.sex == 1){
                obj.sex = "男";
            }else{
                obj.sex = "女";
            }
            var arr = [obj];
            this.tableData = arr;
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
            let set_sex = '0';
            if(this.form.sex == '男'){
                set_sex = '1';
            }
            service.put(baseUrl+'/client', {
                    account: sessionStorage.getItem('ms_username'),
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
        /*handleListener() {
            bus.$on('collapse', this.handleBus);
            // 调用renderChart方法对图表进行重新渲染
            window.addEventListener('resize', this.renderChart);
        },
        handleBus(msg) {
            setTimeout(() => {
                this.renderChart();
            }, 200);
        },
        renderChart() {
            this.$refs.bar.renderChart();
            this.$refs.line.renderChart();
        }*/
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
