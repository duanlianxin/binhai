<template>
	<el-container>
		<el-header height="40px">
			<el-form :inline="true">
				<el-form-item label="用户名字：" size="medium">
					<el-input v-model.trim="search.user_name" prefix-icon="el-icon-search" clearable placeholder="请输入搜索内容" @change="getData()"></el-input>
				</el-form-item>
				<el-form-item label="用户角色：" size="medium">
					<el-select v-model="search.role_id" @change="getData()">
						<el-option :value="0" label="-请选择-"></el-option>
						<el-option
							v-for="item in $store.state.role.list"
							:key="item.role_id"
							:value="item.role_id"
							:label="item.role_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="primary" size="medium" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<div class="table-wrapper">
				<el-table :data="list" border stripe height="100%" style="width: 100%" size="mini">
					<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
					<el-table-column label="用户名字" prop="user_name" width="100" align="center"></el-table-column>
					<el-table-column label="用户密码" prop="user_pwd" width="100" align="center"></el-table-column>
					<el-table-column label="用户角色"  width="100" align="center">
						<template slot-scope="{ row }">
							<span v-text="roleName(row.role_id)" :class="{ dark: row.role_id === null}"></span>
						</template>
					</el-table-column>
					<el-table-column width="240" align="center" label="操作" >
						<template slot-scope="{ row }">
							<el-button type="primary" size="mini" @click="beginUpdate(row)">修改</el-button>
							<el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
							<el-popover placement="right" @show="beginUserRole(row)">
								<h3>{{row.user_name}}用户角色分配：</h3>
								<el-form inline>
									<el-form-item label="角色：" size="medium">
										<el-select v-model="edit.role_id">
											<el-option label="无角色" :value="0"></el-option>
											<el-option
												v-for="item in $store.state.role.list"
												:key="item.role_id"
												:value="item.role_id"
												:label="item.role_name"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<el-button  size="medium" @click="configUserRole">分配</el-button>
									</el-form-item>
								</el-form>
								<el-button type="success" size="mini" slot="reference">角色分配</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-main>
		<el-footer height="30px">
			<el-pagination
				background
				:total="pagination.total"
				:page-size.sync="pagination.pageSize"
				layout="total,prev,pager,next,sizes, ->,jumper"
				:page-sizes="[5,8,10,12,15]"
				:current-page.sync="pagination.currentPage"
				@size-change="getData()"
				@current-change="getData"></el-pagination>
		</el-footer>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`用户维护- ${ edit.mode ? '新增' : '修改'}-`" class="custom-dialog-title"></h2>
			<el-form label-width="100px" :model="edit.model" :rules="edit.validationRules" ref="editForm">
				<el-form-item label="用户名字：" prop="user_name" v-show="edit.mode">
					<el-input v-model.trim="edit.model.user_name" placeholder="请输入用户的名字"></el-input>
				</el-form-item>
				<el-form-item label="用户密码：" prop="user_pwd">
					<el-input v-model.trim="edit.model.user_pwd" placeholder="请输入用户的密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isEdit=false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'User',
	        data(){
                        return{
                                list:[],
                                edit:{
                                        isEdit:false,
	                                mode:true,
	                                role_id:null,
	                                model:{ user_name:'',user_pwd:''},
                                        validationRules:{
                                                user_name:[
	                                                {
	                                                        validator:(rule,value,callback)=>{
									if(value === '')
									        callback(new Error('用户名字不能为空'));
									else if(value.length < 2 && value.length > 20)
                                                                                callback(new Error('用户名字长度为2-20'));
	                                                                else if(!this.edit.mode)
                                                                                callback();
	                                                                else {
	                                                                        this.$http({
		                                                                        url:'/user/valid_name',
		                                                                        method:'post',
		                                                                        data:{ user_name: this.edit.model.user_name}
	                                                                        }).then(count =>{
	                                                                                if(count === 0) callback();
	                                                                                else callback('用户名已存在');
	                                                                        });
									}
	                                                        },
		                                                trigger:'blur'
	                                                }
                                                ],
                                                user_pwd:[
	                                                {required:true,message:'用户密码不能为空',trigger:'blur'},
	                                                {min:2,max:20,message:'用户密码长度为2-20',trigger:'blur'}
                                                ]
                                        }
                                },
	                        pagination: { total: 0, pageSize: 5,currentPage:1 },
	                        search:{ user_name:'', role_id:0}
                        }
	        },
	        computed:{
                        roleName(){
                                return role_id => role_id === null ?'暂无角色' : this.$store.state.role.list.find(item =>item.role_id ===role_id).role_name;
                        }
	        },
	        methods:{
                        getData(currentPage = 1){
                                this.pagination.currentPage = currentPage;
                                this.$http({
                                        url: '/user/list',
                                        method: 'post',
                                        data: {
                                                ...this.search,
                                                begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                                pageSize: this.pagination.pageSize
                                        }
                                }).then(({list,total}) =>{
                                        this.list = list;
                                        this.pagination.total = total;
                                })
                        },
                        remove(user){
                                this.$confirm(`确定要删除用户：“ ${user.user_name}”?`,'警告',{
                                        type: 'warning',
                                        showClass: false
                                })
                                        .then( ()=>this.$http({
                                                url: '/user/remove/' +user.user_name,
                                                method: 'post'
                                        }))
                                        .then(() => {
                                                var i =this.list.findIndex(item => item.user_name === user.user_name);
                                                this.list.splice(i,1)
                                                this.$message({ message:`用户："${user.user_name}"删除成功`, type:'success' })
                                        })
                        },
                        beginAdd: function(){
                                this.edit.mode = true;
                                this.edit.model.role_id = null;
                                this.edit.model.user_name = '';
	                        this.edit.model.user_pwd = '';
                                this.edit.isEdit = true;
                        },
                        beginUpdate: function(user){
                                this.edit.mode = false;
                                this.edit.model.role_id = user.role_id;
                                this.edit.model.user_name = user.user_name;
                                this.edit.model.user_pwd = user.user_pwd;
                                this.edit.isEdit = true;
                        },
                        save: function(){
                                this.$refs.editForm.validate(isValid => {
                                        if(isValid) {
                                                if(this.edit.mode){
                                                        this.$http({
                                                                url: '/user/add',
                                                                method: 'post',
                                                                data: this.edit.model
                                                        })
                                                                .then(data => {
                                                                        this.list.push(Object.assign({},this.edit.model, {data}));
                                                                        this.edit.isEdit = false;
                                                                        this.$message({
                                                                                message: `用户：“${ this.edit.model.user_name}” 添加成功！`,
                                                                                type: 'success'
                                                                        });
                                                                })
                                                }
                                                else{
                                                        this.$http({
                                                                url: '/user/pwdchange',
                                                                method: 'post',
                                                                data: this.edit.model
                                                        }).then( () =>{
                                                                var i =this.list.findIndex(item => item.user_name === this.edit.model.user_name);
                                                                this.list.splice(i,1,Object.assign({},this.edit.model));
                                                                this.edit.isEdit = false;
                                                                this.$message({
                                                                        message: `用户：“${ this.edit.model.user_name}” 修改成功！`,
                                                                        type: 'success'
                                                                });
                                                        })
                                                }
                                        }
                                })
                        },
                        beginUserRole(user){
                                this.edit.role_id = user.role_id || 0;
                                this.edit.model.user_name = user.user_name;
                        },
                        configUserRole(){
				this.$http({
					url:'/user/config_role',
					method:'post',
					data:
						{
						        user_name: this.edit.model.user_name,
							role_id:this.edit.role_id
					}
				}).then(()=>{
					var i =this.list.findIndex(item =>item.user_name === this.edit.model.user_name);
					this.list[i].role_id = this.edit.role_id || null;
					this.$message({ message:`用户"${ this.edit.model.user_name}"分配成功`, type:'success'})
				})
                        }
	        },
	        created(){
	                this.$store.dispatch('role/init');
                        this.getData();
	        },
                watch:{
                        'edit.isEdit'(newValue,oldValie){
                                if(!newValue){
                                        this.$refs.editForm.resetFields();
                                }
                        },
                }
        };
</script>

<style scoped>
	.el-container { height: 100%;}
	.el-main { position: relative}
	.el-main>.table-wrapper {
		box-sizing: border-box; position: absolute;
		width: 100%;height: 100%;
		top: 0; left:0;
		padding: 10px;
		overflow: hidden
	}
	.dark { color:  #ccc; }
	.el-button { margin-left: 5px; }
</style>