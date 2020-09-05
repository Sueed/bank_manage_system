<template>
	<el-card class="box-card" v-loading="loading">
		<ul class="msg-box">
			<li>
				<h4 style="margin-bottom:15px;">操作模式</h4>
				<el-radio-group v-model="rechargeParams.transType">
      				<el-radio-button label="存款"></el-radio-button>
      				<el-radio-button label="取款"></el-radio-button>
    			</el-radio-group>
			</li>
			<li>
				<h4 style="margin-bottom: 15px;">操作对象</h4>
                 <el-select v-model="select_target" disabled placeholder="地府银行">
    				<el-option
      					v-for="item in options"
      					:key="item.value"
      					:label="item.label"
      					:value="item.value">
    				</el-option>
  				</el-select>
                <el-input style="width: 300px;" placeholder="请输入操作对象卡号" v-model="target_id"></el-input>
			</li>
			<li >
				<h4 style="margin-bottom: 15px;">选择操作金额</h4>
				<el-radio-group  v-model="amountVal" @change="amountChange">
					<el-radio border :label="''+ 100">100</el-radio>
					<el-radio border :label="''+ 500">500</el-radio>
					<el-radio border :label="''+ 1000">1000</el-radio>
					<el-radio border :label="''+ 2000">2000</el-radio>
					<el-radio border :label="''+ 5000">5000</el-radio>
					<el-radio border :label="''">自定义</el-radio>
				</el-radio-group>
			</li>
			<li >
				<h4 style="margin-bottom: 15px;">确认操作金额</h4>
				<el-input :disabled="disabled" clearable v-model="rechargeParams.totalAmt" placeholder="请输入金额" style="width: 150px;"></el-input>
			</li>
		</ul>
		<div style="text-align: center; margin-top: 30px;">
			<el-button type="primary" @click="surePay">确认操作</el-button>
		</div>
	</el-card>
</template>
 
<script>
import baseUrl from '@/api/baseUrl';
import service from '@/utils/request';
	export default {
		data() {
			return {
				target_id:'',
				amountVal: '',
				disabled: false,
				rechargeParams: {
					"totalAmt": '', //金额
					"transType": '存款' 
				},
				options: [{
          			value: 'bank',
          			label: '地府银行'
				}, 
				{
          			value: 'security',
         			label: '天堂证券'
        		}],
				select_target: '',
				loading: false
			}
		},
		methods: {
			//金额
			amountChange(val) {
				this.rechargeParams.totalAmt = val;
				if (val == '') {
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
			async surePay(){
				this.loading = true;
				if(this.rechargeParams.transType == '存款'){
					service.put(baseUrl+'/save', {
                    accountId: this.target_id,
                    money: this.rechargeParams.totalAmt
            	})
            		.then(function (response) {
					//console.log(response)
                	if(response.code.valueOf("6101")){
						this.loading = false;
						this.$message.success(`存款成功`);
                	}else{
						this.loading = false;
                	    this.$message.error(`存款失败，原因：`+response.msg);
                	}}.bind(this))
            		.catch(function (error) { 
                		console.log(error);
            		});
				}else if(this.rechargeParams.transType == '取款'){
					service.put(baseUrl+'/withdraw', {
                    accountId: this.target_id,
                    money: this.rechargeParams.totalAmt
            	})
            		.then(function (response) {
					//console.log(response)
                	if(response.code.valueOf("6101")){
						this.loading = false;
                	    this.$message.success(`取款成功`);
                	}else{
						this.loading = false;
                	    this.$message.error(`取款失败，原因：`+response.msg);
                	}}.bind(this))
            		.catch(function (error) { 
                		console.log(error);
            		});
				}
			}
		}
	}
</script>
 
<style scoped>
	/* 信息列表样式 */
	.msg-box > li {
		list-style: none;
		border-bottom: 1px solid #c5c5c5;
		padding: 20px 10px;
        float:inline-start;
	}
</style>