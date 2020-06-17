<template>
	<el-form label-width="120px" ref="form" :model="model" :rules="validateRules">
		<el-form-item label="原始密码：" prop="oldPwd">
			<el-input type="password" v-model.trim="model.oldPwd"></el-input>
		</el-form-item>
		<el-form-item label="新密码：" prop="newPwd">
			<el-input type="password" v-model.trim="model.newPwd"></el-input>
		</el-form-item >
		<el-form-item label="确认密码" prop="newPwd2">
			<el-input type="password" v-model.trim="model.newPwd2"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="success" @click="okHandler">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'PwdChange',
	        data(){
                        return{
                                model:{ oldPwd:'',newPwd:'',newPwd2:''},
                                validateRules:{
                                        oldPwd:[
	                                        {required:true,message:'原始密码不鞥为空', trigger:'blur'},
	                                        { min:6,max:20,message:'原始密码的长度为6-20',trigger:'blur'}
                                        ],
                                        newPwd:[
	                                        {
	                                                validator:(rule,value,callback) =>{
	                                                        if(value === '')
	                                                                callback(new  Error('新密码必填'));
	                                                        else if(value.length < 6 || value.length >20)
                                                                        callback(new  Error('密码长度6-20'));
	                                                        else if(value === this.model.oldPwd)
                                                                        callback(new  Error('新旧密码一样。脑子瓦塔了'));
	                                                        else {
	                                                                if(this.model.newPwd2 !== ''){
                                                                                this.$refs.form.validateField('newPwd2');
	                                                                }
	                                                                callback();
	                                                        }
	                                                },
		                                        trigger:'blur'
	                                        }
                                        ],
                                        newPwd2:[
                                                {
                                                        validator:(rule,value,callback) =>{
                                                                if(value === '')
                                                                        callback(new  Error('请再次输入密码'));
                                                                else if(value !== this.model.newPwd)
                                                                        callback(new  Error('两次输入密码不一致'));
                                                                else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger:'blur'
                                                }
                                        ]
                                }

                        }
	        },
	        methods:{
                        okHandler(){
                              this.$refs.form.validate(valid =>{
                                      if(valid){
                                              this.$http({
							url:'/user/pwdchange',
	                                              method:'post',
	                                              data: this.model
                                              }).then(() =>{
                                                      this.$message({ message:'密码修改成功',type:'success'})
                                                      this.$refs.form.resetFields();//重置表单
                                              })
                                      }
                              })
                        }
	        }
        };
</script>

<style scoped>
	.el-form { width: 400px;}
</style>