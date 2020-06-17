<template>
	<el-container>
		<el-header height="30px">
			<el-form :inline="true" size="mini">
				<el-form-item label="班级名字：" >
					<el-input v-model.trim="search.cls_name" placeholder="请输入搜索内容" prefix-icon="el-icon-search" clearable @change="getData()"></el-input>
				</el-form-item>
				<el-form-item label="专业方向：">
					<el-select v-model.trim="search.cls_dic_id_major" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="-所有专业-"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态:">
					<el-select v-model.trim="search.cls_status" @change="getData()">
						<i slot="prefix" class="el-icon-search"></i>
						<el-option :value="0" label="-所有状态-" ></el-option>
						<el-option :value="1" label="开课中" ></el-option>
						<el-option :value="2" label="未开课" ></el-option>
						<el-option :value="3" label="结课" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="primary" class="el-icon-plus" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<div class="table-wrapper">
				<el-table :data="list" border stripe :highlight-current-row="true" height="100%" size="mini">
					<el-table-column type="index" label="序号" fixed width="50" align="center"></el-table-column>
					<el-table-column label="班级名称" prop="cls_name" width="80" align="center" fixed></el-table-column>
					<el-table-column label="班级专业"  width="80" align="center">
						<template slot-scope="{ row }">
							<span v-text="$store.getters['dictionary/getNameById'](row.cls_dic_id_major)"></span>
						</template>
					</el-table-column>
					<el-table-column label="教室" width="80" align="center">
						<template slot-scope="{ row }">
							<span v-if="row.cls_clsr_id === null"></span>
							<span v-else v-text="$store.getters['classroom/getNameById'](row.cls_clsr_id)"></span>
						</template>
					</el-table-column>
					<el-table-column label="授课老师"  width="80" align="center" >
						<template slot-scope="{ row }">
							<span v-text="staffListTeacher.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="教务老师"  width="80" align="center" >
						<template slot-scope="{ row }">
							<span v-text="staffListAdmin.find(item => item.stf_id === row.cls_stf_id_admin).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="就业老师"  width="80" align="center" >
						<template slot-scope="{ row }">
							<span v-text="staffListJob.find(item => item.stf_id === row.cls_stf_id_job).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="开课时间" prop="cls_begin" width="100" align="center"></el-table-column>
					<el-table-column label="结课时间" prop="cls_end" width="100" align="center"></el-table-column>
					<el-table-column label="班级状态" width="150" align="center">
						<template slot-scope="{ row }">
							<span v-if="row.cls_begin === null" style="color: #e6a23c">未开课</span>
							<span v-else-if="row.cls_end === null" style="color: #67c23a">开课中</span>
							<span v-else style="color: #ccc">结课</span>
						</template>
					</el-table-column>
					<el-table-column label="班级备注" width="100" show-overflow-tooltip>
						<template slot-scope="{ row}">
							<span v-text="row.cls_remark || '暂无相关备注'" :class="{ empty: !row.cls_remark}"></span>
						</template>
					</el-table-column>

					<el-table-column width="200" align="center" label="操作" fixed="right">
						<template slot-scope="{ row }">
							<el-button type="success" size="mini" @click="beginUpdate(row)">编辑</el-button>
							<el-button type="primary" size="mini" v-if="row.cls_begin ===null" @click="beginClassBegin(row)">开班</el-button>
							<el-button type="warning" size="mini" v-else-if="row.cls_end ===null" @click="classend(row)">结课</el-button>

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
				:current-page.sync="pagination.currentPage"
				layout="total,prev,pager,next,sizes, ->,jumper"
				:page-sizes="[5,8,10,12,15]"
				@size-change="getData()"
				@current-change="getData">
			</el-pagination>
		</el-footer>
		<!--新增修改编辑对话框-->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`班级维护- ${ edit.mode ? '新增' : '修改'}-`" class="custom-dialog-title"></h2>
			<el-form label-width="100px" :model="edit.model" :rules="edit.validationRules" ref="editForm" size="mini">
				<el-form-item label="班级名称：" prop="cls_name">
					<el-input v-model.trim="edit.model.cls_name" placeholder="请输入班级名称"></el-input>
				</el-form-item>
				<el-form-item label="专业方向：" prop="cls_dic_id_major">
					<el-select v-model.trim="edit.model.cls_dic_id_major" >
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教室" v-show="edit.model.cls_begin !== null && edit.model.cls_end === null">
					<el-select v-model="edit.model.cls_clsr_id">
						<el-option v-for="item in $store.state.classroom.list" :key="item.clsr_id" :value="item.clsr_id" :label="item.clsr_name" :disabled="(!!item.clsr_occupy) && !list.some(item2 =>item2.cls_id === edit.model.cls_id && item2.cls_clsr_id === item.clsr_id)" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授课老师：" prop="cls_stf_id_teacher">
					<el-select v-model="edit.model.cls_stf_id_teacher">
						<el-option v-for="item in staffListTeacher" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教务老师：" prop="cls_stf_id_admin">
					<el-select v-model="edit.model.cls_stf_id_admin">
						<el-option v-for="item in staffListAdmin" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="就业老师：" prop="cls_stf_id_job">
					<el-select v-model="edit.model.cls_stf_id_job">
						<el-option v-for="item in staffListJob" :key="item.stf_id" :value="item.stf_id" :label="item.stf_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注：">
					<el-input type="textarea" :rows="2" v-model.trim="edit.model.cls_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary"  size="mini" @click="save">保存</el-button>
				<el-button @click="edit.isEdit=false" size="mini">取消</el-button>
			</div>
		</el-dialog>
		<!--班级开班对话框-->
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit2.isEdit"
			:show-close="false">
			<h2 slot="title" class="custom-dialog-title">开班</h2>
			<el-form label-width="100px" :model="edit2.model" :rules="edit2.validationRules" ref="editForm2" size="mini" status-icon>
				<el-form-item label="教室" prop="cls_clsr_id">
					<el-select v-model="edit2.model.cls_clsr_id">
						<el-option v-for="item in $store.state.classroom.list" :key="item.clsr_id" :value="item.clsr_id" :label="item.clsr_name" :disabled="(!!item.clsr_occupy)"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary"  size="mini" @click="classBegin">保存</el-button>
				<el-button @click="edit2.isEdit=false" size="mini">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'Class',
	        data(){
                        return {
                                list:[],
	                        staffListTeacher:[],
                                staffListAdmin:[],
                                staffListJob:[],
                                search:{ cls_name: '', cls_dic_id_major: 0, cls_status: 0 },
                                pagination: { total: 0, pageSize: 5, currentPage: 1},
	                        //班级新增修改驱动数据
                                edit: {
                                        isEdit: false,
	                                mode: true,
	                                model: {
                                                cls_id: 0, cls_name:'',cls_dic_id_major: null, cls_clsr_id: null,
		                                cls_stf_id_teacher: null, cls_stf_id_admin: null, cls_stf_id_job: null,
		                                cls_begin: null,cls_end: null,cls_remark:null
	                                },
	                                validationRules: {
                                                cls_name:[
	                                                {
	                                                        validator:(rule,value,callback)=>{
									if(value === '') callback(new Error('班级名不能为空'));
									else if( value.length < 2 || value.length > 20) callback(new Error('班级名长度为2-20'));
									else if(this.list.some(item => item.cls_id === this.edit.model.cls_id && item.cls_name === value)) callback();
									else {
										this.$http({
											url:'/class/valid_name',
											method:'post',
											data:{ cls_name:value}
										}).then(count=>{
										        if(count === 0) callback();
										        else callback(new Error('班级名字已经存在'));
										})
									}
	                                                        },
		                                                trigger:'blur'
	                                                }
                                                ],
		                                cls_dic_id_major:[{required:true,message:'班级专业必选',trigger:'change'}],
		                                cls_stf_id_teacher:[{required:true,message:'授课老师必选',trigger:'change'}],
                                                cls_stf_id_admin:[{required:true,message:'教务老师必选',trigger:'change'}],
                                                cls_stf_id_job:[{required:true,message:'就业老师必选',trigger:'change'}],
	                                }
                                },
	                        //班级开班的驱动数据
	                        edit2:{
                                        isEdit: false,
		                        model: { cls_id: 0,cls_clsr_id: null,},
		                        validationRules: {
                                                cls_clsr_id: [{ required: true,message:'开班教室必选',trigger:'change'}]
		                        }
	                        },
                        }
	        },
	        methods:{
                        getData(currentPage = 1){
                                this.pagination.currentPage = currentPage;
                                this.$http({
                                        url: '/class/list',
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
		        beginAdd(){
				this.edit.mode = true;
                                this.edit.isEdit = true;
		        },
		        beginUpdate(cls){
                                this.edit.model.cls_id = cls.cls_id;
                                this.edit.model.cls_name = cls.cls_name;
                                this.edit.model.cls_dic_id_major = cls.cls_dic_id_major;
                                this.edit.model.cls_clsr_id = cls.cls_clsr_id;
                                this.edit.model.cls_stf_id_teacher = cls.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = cls.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = cls.cls_stf_id_job;
                                this.edit.model.cls_begin = cls.cls_begin;
                                this.edit.model.cls_end = cls.cls_end;
                                this.edit.model.cls_remark = cls.cls_remark;

                                this.edit.mode = false;
                                this.edit.isEdit = true;
		        },
		        //保存(新增修改)
		        _saveWithAdd(){
		                this.$http({ url:'/class/add', method:'post', data: this.edit.model})
			                .then(cls_id => {
			                        this.list.push(Object.assign({},this.edit.model,{ cls_id}));
			                        this.$message({ message:`班级："${this.edit.model.cls_name}"添加成功`,type:'success'});
						this.edit.isEdit = false;
		                });
		        },
                        _saveWithUpdate(){
                                this.$http({ url:'/class/update', method:'post', data: this.edit.model})
                                        .then(() => {
                                                var i = this.list.findIndex(item =>item.cls_id === this.edit.model.cls_id);
                                                if(this.list[i].cls_clsr_id !== this.edit.model.cls_clsr_id) {  //班级对应的教室是否修改了
                                                        this.$store.commit('classroom/toggleStatus',this.list[i].cls_clsr_id);
                                                        this.$store.commit('classroom/toggleStatus',this.edit.model.cls_clsr_id);
                                                }
						this.list.splice(i,1,Object.assign({},this.edit.model));
                                                this.$message({ message:`班级："${this.edit.model.cls_name}"修改成功`,type:'success'});
                                                this.edit.isEdit = false;
                                        });
                        },
		        save(){
                                this.$refs.editForm.validate(isValid => { //代码触发验证
                                        if(isValid) {
                                                //新增
	                                        if(this.edit.mode) this._saveWithAdd();
	                                        //修改
	                                        else this._saveWithUpdate();
                                        }
                                })
		        },
		        //开课
		        beginClassBegin(cls){
		                this.$confirm(`确定要对班级：“${ cls.cls_name}”进行开班操作吗？`,'警告',{ showClose:false,type:'warning'})
			                .then(() => {
		                                this.edit2.model.cls_id = cls.cls_id;
		                                this.edit2.isEdit = true;
			                })
		        },
		        classBegin(){
		                this.$refs.editForm2.validate(isValid =>{
		                        if(isValid) {
		                                this.$http({ url:'/class/begin',method:'post',data: this.edit2.model})
			                                .then(cls_begin =>{
			                                        var i = this.list.findIndex(item =>item.cls_id === this.edit2.model.cls_id);
			                                        this.list.splice(i,1,Object.assign({},this.list[i],{cls_begin,cls_clsr_id: this.edit2.model.cls_clsr_id}));
								this.$store.commit('classroom/toggleStatus',this.edit2.model.cls_clsr_id);
			                                        this.$message({ message:'开班成功',type:'success'});
				                                this.edit2.isEdit = false;
			                                })
		                        }
		                })

		        },
		        //结课
                        classend(cls){
                                this.$confirm(`确定要对班级：“${ cls.cls_name}”进行结课操作吗？`,'警告',{ showClose:false,type:'warning'})
                                        .then(() => {
						this.$http({ url:'/class/end', method:'post', data:{ cls_id: cls.cls_id}})
							.then(cls_end => {
                                                                var i = this.list.findIndex(item =>item.cls_id === cls.cls_id);
                                                                this.list.splice(i,1,Object.assign({},this.list[i],{cls_end}));
                                                                this.$store.commit('classroom/toggleStatus',this.list[i].cls_clsr_id);
                                                                this.$message({ message:'结课成功',type:'success'});
	                                        })
							.catch(() =>{})
                                        })
                        }

	        },
	        async created(){
	                this.$store.dispatch('classroom/init');
                        //拿取  所有教学老师信息
                        this.staffListTeacher = await this.$http({ url: '/staff/listbycategory/4', method: 'get' });
                        this.staffListAdmin = await this.$http({ url: '/staff/listbycategory/5', method: 'get' });
                        this.staffListJob = await this.$http({ url: '/staff/listbycategory/6', method: 'get' });
                        this.getData();
	        },
	        watch:{
	                'edit.isEdit'(newValue,oldValue){
	                        if(!newValue){  //对话框关闭了
                                        this.edit.model.cls_id = 0;
                                        this.edit.model.cls_name = '';
                                        this.edit.model.cls_dic_id_major = null;
                                        this.edit.model.cls_clsr_id = null;
                                        this.edit.model.cls_stf_id_teacher = null;
                                        this.edit.model.cls_stf_id_admin = null;
                                        this.edit.model.cls_stf_id_job = null;
                                        this.edit.model.cls_begin = null;
                                        this.edit.model.cls_end = null;
                                        this.edit.model.cls_remark = null;
	                        } else {               //对话框打开了
                                        if(this.$refs.editForm)//重置表单及清空验证
                                                this.$refs.editForm.clearValidate();
	                        }
	                },
                        'edit2.isEdit'(newValue,oldValue){
	                        if(!newValue) {
	                                this.edit2.model.cls_id = 0;
	                                this.edit2.model.cls_clsr_id = null;
	                        }else {
                                        if(this.$refs.editForm2)//重置表单及清空验证
                                                this.$refs.editForm2.clearValidate();
	                        }
                        }
	        }


        };
</script>

<style scoped>
	.el-container { height: 100%; }
	/*为了表格设置最大高度*/
	.el-main { position: relative}
	.el-main>.table-wrapper {
		box-sizing: border-box; position: absolute;
		width: 100%;height: 100%;
		top: 0; left:0;
		padding: 10px;
		overflow: hidden
	}
	.empty { color: #ccc}

	h2.custom-dialog-title {
		background-color: #0094ff;
		text-indent: 2em;
		color: #fff;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
	}
</style>