<template>
	<el-card class="box-card">
		<ul class="msg-box">
			<li>
				<h4 style="margin-bottom:15px;">银证转账模式</h4>
			</li>
			<li>
				<h4 style="margin-bottom: 15px;">转账对象</h4>
                 <el-select v-model="select_target" placeholder="请选择转账对象所属机构">
    				<el-option
      					v-for="item in options"
      					:key="item.value"
      					:label="item.label"
      					:value="item.value">
    				</el-option>
  				</el-select>
                <el-input style="width: 300px;" placeholder="请输入转账对象卡号" v-model="target_id"></el-input>
			</li>
			<li>
				<h4 style="margin-bottom: 15px;">扣款对象</h4>
                 <el-select v-model="hell" disabled  placeholder="请选择扣款对象所属机构">
  				</el-select>
                <el-input style="width: 300px;" placeholder="请输入转账对象卡号" v-model="hell_id"></el-input>
			</li>
			<li >
				<h4 style="margin-bottom: 15px;">选择转账金额</h4>
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
				<h4 style="margin-bottom: 15px;">确认转账金额</h4>
				<el-input :disabled="disabled" clearable v-model="rechargeParams.totalAmt" placeholder="请输入转账金额" style="width: 150px;"></el-input>
			</li>
		</ul>
		<div style="text-align: center; margin-top: 30px;">
			<el-button type="primary" @click="surePay">确认转账</el-button>
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
					"transType": '转账' 
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
				hell:'地府银行',
				hell_id:''
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
				if(this.select_target == 'bank'){
					service.put(baseUrl+'/transfer', {
					accountId: this.hell_id,
					anoAccountId : this.target_id,
                    money: this.rechargeParams.totalAmt
            	})
            		.then(function (response) {
					console.log(response)
                	if(response.code.valueOf("6001")){
                	    this.$message.success(`地府银行内部转账成功`);
                	}else{
                	    this.$message.error(`地府银行内部转账存款失败，原因：`+response.msg);
                	}}.bind(this))
            		.catch(function (error) { 
                		console.log(error);
            		});
				}else if(this.select_target == 'security'){
					service.put(baseUrl+'/transfer', {
                    accountId: this.hell_id,
					anoAccountId : this.target_id,
                    money: this.rechargeParams.totalAmt
            	})
            		.then(function (response) {
					console.log(response)
                	if(response.code.valueOf("6001")){
                	    this.$message.success(`向天堂证券方转账成功`);
                	}else{
                	    this.$message.error(`向天堂证券方转账失败，原因：`+response.msg);
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