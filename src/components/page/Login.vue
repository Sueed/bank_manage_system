<template>
    <div class="login-container">
        <el-form :model="param" :rules="rules"
         status-icon
         ref="login" 
         label-position="left" 
         label-width="0px" 
         class="demo-ruleForm login-page">
            <h3 class="title">Sign Up</h3>
            <el-form-item prop="username">
                <el-input type="text" 
                    v-model="param.username" 
                    auto-complete="off" 
                    placeholder="Username"
                ></el-input>
            </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" 
                        v-model="param.password" 
                        auto-complete="off" 
                        placeholder="Password"
                        @keyup.enter.native="submitForm()"
                    ></el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:95%;" @click="submitForm()" :loading="logining">Login</el-button>
            </el-form-item>
            <el-form-item>
                <el-switch
                        style="display: block"  v-model="logintype1"
                        active-color="#66BD6C"
                        inactive-color="#66BD6C"
                        active-text="客户"
                        inactive-text="管理员">
                </el-switch>
            </el-form-item>
        </el-form>
        <el-button id="dev_login" @click="super_dev_login">
            <!-- 开发者登录部分 -->
        </el-button>
    </div>
</template>

<script>
import baseUrl from '@/api/baseUrl';
import service from '@/utils/request';
export default {
    data: function() {
        return {
            logining: false,
            logintype1: true,
            param: {
                username: 'ASAS',
                password: '111111',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            checked: false
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    if(this.logintype1.valueOf("true")){
                        service.post(baseUrl+'/login/client', {
                            account: this.param.username,
                            password: this.param.password
                        })
                        .then(function (response) {
                        if(response.code.valueOf("1001")){
                            this.$message.success('登录成功');
                            sessionStorage.setItem('ms_username', this.param.username);
                            sessionStorage.setItem('login_type', "user");
                            sessionStorage.setItem('login_data',JSON.stringify(response.data));
                            this.$router.push({path: '/user/dashboard'});
                        }}.bind(this)).catch(function (error) { 
                        console.log(error);
                        });
                    }else{
                        service.post(baseUrl+'/login/user', {
                            account: this.param.username,
                            password: this.param.password
                        })
                        .then(function (response) {
                        if(response.code.valueOf("1001")){
                            this.$message.success('登录成功');
                            sessionStorage.setItem('ms_username', this.param.username);
                            sessionStorage.setItem('login_type', "admin");
                            sessionStorage.setItem('login_data', response.data);
                            this.$router.push({path: '/admin/dashboard'});
                        }}.bind(this)).catch(function (error) { 
                        console.log(error);
                        });
                    }
                } else {
                    this.$message.error('请输入账号和密码');
                    //console.log('error submit!!');
                    return false;
                }
            });
        },
        super_dev_login(event){
            this.$message.warning('咱开发者登录不需要密码嘻嘻');
            service.post(baseUrl+'/login/dev', {
            })
            .then(function (response) {
            if(response.code.valueOf("1001")){
                sessionStorage.setItem('ms_username', "dev");
                sessionStorage.setItem('login_type', "dev");
                this.$router.push({path: '/dev/dashboard'});
            }}.bind(this)).catch(function (error) { 
            console.log(error);
            });
        }
    },
};
</script>

<style scoped>
*{
    margin: 5px;
}
.login-container {
    width: 100%;
    height: 100%;
    background:url(../images/login.jpg);
    background-size: cover;
    padding:0px;
    margin:0px;
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    border:hidden;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background:rgba(255, 255, 77, 0.651);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
#dev_login{
    width:50px;
    height:50px;
    position: absolute;
    top:385px;
    left:100px;
    background: transparent;    
    border:none;
}
</style>