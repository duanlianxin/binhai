<template>
	<div class="page-wrapper">
		<h1>青 岛 滨 海 学 院</h1>
		<div class="form-wrapper">
			<h2>青岛滨海学院管理系统</h2>
			<el-form ref="loginForm" :model="model" :rules="ValidateRules">
				<el-form-item prop="user_name">
					<el-input v-model.trim="model.user_name">
						<template slot="prepend">
							<i class="el-icon-s-custom"></i>用户名
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="user_pwd">
					<el-input type="password" v-model.trim="model.user_pwd">
						<template slot="prepend">
							<i class="el-icon-lock"></i>密码
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'Login',
	        data(){
                        return {
                                model: {user_name: '',user_pwd: ''},
                                ValidateRules:{
                                        user_name:[
	                                        { require: true, message: '用户名不能为空', trigger: 'blur' },
	                                        { min: 2, max: 20, message: '用户名长度2-20', trigger: 'blur'}
                                        ],
                                        user_pwd:[
                                                { require: true, message: '密码不能为空', trigger: 'blur' },
                                                { min: 3, max: 16, message: '密码长度3-16', trigger: 'blur'}
                                        ]
                                }
                        }
                },
	        methods: {
			login(){
				this.$refs.loginForm.validate(valid =>{
				        if(valid) {
						this.$http({
							url:'/user/login',
							method:'post',
							data:this.model
						}).then(token=> {
						        sessionStorage.setItem('token',token);
						        //把前一个用户的名字放在prev_user中
						        sessionStorage.setItem('prev_user', sessionStorage.getItem('user') || '');
                                                        //把当前登录的放在prev_user中
						        sessionStorage.setItem('user',this.model.user_name);


						        this.$message({ message:'登录成功！',type:'success'});
						        this.$router.replace('/home')
						})
				        }
				})
                        }
	        },
	        created(){ sessionStorage.removeItem('isExist401'); }

        };
</script>

<style scoped>
	@keyframes fade {
		0% { opacity: 0; right: 100%;transform: translateY(10%) rotateY(0deg);}
		20% {opacity: 1;right: 30%;transform: translateY(10%) rotateY(0deg);}
		60% {opacity: 1; right: 30%;transform: translateY(10%) rotateY(45deg);}
		100% {opacity: 1; right: 20%;transform: translateY(10%) rotateY(45deg);}
	}
	.page-wrapper { height: 100%; position: relative; perspective: 600px}
	.page-wrapper>h1 {
		position: absolute; bottom: 50%; right: 100%;transform: translateY(10%);
		transform-origin: left center;
		font-size: 120px; color: #0094ff;
		border-bottom: 1px solid #0094ff;
		padding: 10px 50px;
		text-shadow: -10px 10px 0  #000;
		white-space: nowrap;
		opacity: 0;
		animation-name: fade;                               /*自动移动化的名字*/
		animation-duration: 1s;                           /*自定义动画持续的时间*/
		animation-fill-mode: forwards;                          /*自定义动画结束状态设置*/
		animation-timing-function: ease-out ;                /*自定义动画曲线*/
		animation-delay:1s ;                                /*自定义动画执行延时时间*/
	}
	.page-wrapper>h1:before {
		content: '青 岛 滨 海 学 院';
		padding: 10px 50px;
		text-shadow: -10px 10px 0  #000;
		font-size: 120px; color: #0094ff;
		position: absolute; top:100%; left: 0;
		transform: scaleY(-0.8);
	}
	.page-wrapper>h1:after{
		content: '';
		position: absolute; top:100%; left: 0;
		width: 100%; height: 100%;
		background-image: linear-gradient(to bottom, transparent,#fff);

	}

	
	@keyframes slide {
		0% { left: 100%}
		100% { left: 60%}
	}
	.form-wrapper  {
		position: absolute;  top:50%;  left: 100%;
		transform: translateY(-50%);
		width:350px ;
		height: 370px;
		background-image: url("../../assets/1.jpg");
		border-radius: 5px;
		animation-name: slide;                               /*自动移动化的名字*/
		animation-duration: .6s;                           /*自定义动画持续的时间*/
		animation-fill-mode: forwards;                          /*自定义动画结束状态设置*/
		animation-timing-function: ease-out ;                /*自定义动画曲线*/
		animation-delay:1s ;                                /*自定义动画执行延时时间*/

	}
	.form-wrapper>h2 {
		padding: 40px 0;
		text-align: center;
		font-size: 26px;
		text-shadow: 0 1px 0px #fff;
	}
	.el-form {padding: 0 20px;}
	.el-form-item {
		margin-bottom: 30px;
		text-align: center;
	}
	/deep/ .el-input-group__prepend {
		padding: 0;
		width: 65px;
	}
</style>