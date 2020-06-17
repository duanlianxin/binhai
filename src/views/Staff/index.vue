<template>
	<el-container>
		<el-header height="30px">
			<el-form :inline="true">
				<el-form-item label="员工姓名" >
					<el-input size="small" placeholder="请输入员工姓名" v-model="search.stf_name" clearable @change="getData()"></el-input>
				</el-form-item>
				<el-form-item label="员工类别" >
					<el-select v-model="search.stf_category" @change="getData()" size="small">
						<el-option :value="0" label="-请选择-"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('staff_category')"
							:key="item.dic_key"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right">
					<el-button type="success" size="small" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<div class="table-wrapper">
				<el-table :data="list" border stripe style="width: 100%"  height="100%">
					<el-table-column type="index" label="序号" fixed width="50" align="center"></el-table-column>
					<el-table-column label="员工姓名" prop="stf_name" width="80" align="center" fixed></el-table-column>
					<el-table-column label="员工类别"  width="80" align="center">
						<template slot-scope="{ row}">
							<span v-text="$store.getters['dictionary/getNameById'](row.stf_category)"></span>
						</template>
					</el-table-column>
					<el-table-column label="员工备注">
						<template slot-scope="{ row}">
							<span v-text="row.stf_remark || '暂无相关备注'" :class="{ empty: !row.stf_remark}"></span>
						</template>
					</el-table-column>
					<el-table-column label="员工状态"  width="80" align="center">
						<template slot-scope="{ row }">
							<span v-text="row.stf_invalid ? '入职' : '离职'" :class="{dimission: !row.stf_invalid}"></span>
						</template>
					</el-table-column>
					<el-table-column width="200" align="center" label="操作" fixed="right">
						<template slot-scope="{ row }">
							<el-button type="primary" size="mini" @click="beginUpdate(row)">修改</el-button>
							<el-button type="warning" size="mini" v-if="!row.stf_invalid" @click="reinstateHandler(row)">入职</el-button>
							<el-button type="danger" size="mini" v-else @click="dimissionHandler(row)">离职</el-button>
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
				@current-change="getData">
			</el-pagination>
		</el-footer>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`员工维护- ${ edit.mode ? '新增' : '修改'}-`" class="custom-dialog-title"></h2>
			<el-form label-width="100px" :model="edit.model" :rules="edit.validationRules" ref="editForm">
				<el-form-item label="员工名字：" prop="stf_name">
					<el-input v-model.trim="edit.model.stf_name" placeholder="请输入员工的名字"></el-input>
				</el-form-item>
				<el-form-item label="员工类型：" prop="stf_category">
					<el-select  v-model="edit.model.stf_category">
						<el-option :value="0" label="-请选择员工类型-"></el-option>
						<el-option
							v-for="item in $store.getters['dictionary/getGroupByKey']('staff_category')"
							:key="item.dic_key"
							:value="item.dic_id"
							:label="item.dic_name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工备注：">
					<el-input type="textarea" :rows="2" v-model.trim="edit.model.stf_remark"></el-input>
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
                name:'Staff',
	        data(){
                        return {
                                search: { stf_name: '', stf_category: 0 },
                                pagination:{total: 0, pageSize: 5,currentPage:1 },
	                        list: [],
	                        edit:{
                                        isEdit:false,
		                        mode: true,
		                        model:{ stf_id: 0,stf_name:'',stf_category:0,stf_remark:''},
		                        validationRules:{
                                                stf_name:[
	                                                { required: true, message:'员工名字不能为空',trigger:'blur'},
	                                                {min:2,max:20,message:'员工名字长度为2-20',trigger:'blur'}
                                                ],
                                                stf_category:[
	                                                {
	                                                        validator:(rule,value,callback)=> {
									if(value === 0)
									        callback(new Error('请选择员工的类型'));
		                                                        else
		                                                                callback();
	                                                        },
		                                                trigger:'change'
	                                                }
                                                ]
		                        }
	                        }
                        }
                },
	        methods:{
                        beginAdd: function(){
                                this.edit.mode = true;
                                this.edit.model.stf_id = 0;
                                this.edit.model.stf_name = '';
                                this.edit.model.stf_category = '';
                                this.edit.model.stf_remark = '';
                                this.edit.isEdit = true;
                        },
                        beginUpdate: function(staff){
                                this.edit.mode = false;
                                this.edit.model.stf_id = staff.stf_id;
                                this.edit.model.stf_name = staff.stf_name;
                                this.edit.model.stf_category = staff.stf_category;
                                this.edit.model.stf_remark = staff.stf_remark;
                                this.edit.isEdit = true;
                        },
                        save: function(){
                                this.$refs.editForm.validate(isValid => {
                                        if(isValid) {
                                                if(this.edit.mode){
                                                        this.$http({
                                                                url: '/staff/add',
                                                                method: 'post',
                                                                data: this.edit.model
                                                        })
                                                                .then(data => {
                                                                        this.list.push(Object.assign({},this.edit.model, {data}));
                                                                        this.edit.isEdit = false;
                                                                        this.$message({
                                                                                message: `员工：“${ this.edit.model.stf_name}” 添加成功！`,
                                                                                type: 'success'
                                                                        });
                                                                })
                                                }
                                                else{
                                                        this.$http({
                                                                url: '/staff/update',
                                                                method: 'post',
                                                                data: this.edit.model
                                                        }).then( () =>{
                                                                var i =this.list.findIndex(item => item.stf_id === this.edit.model.stf_id);
                                                                this.list.splice(i,1,Object.assign({},this.edit.model));
                                                                this.edit.isEdit = false;
                                                                this.$message({
                                                                        message: `员工：“${ this.edit.model.stf_name}” 修改成功！`,
                                                                        type: 'success'
                                                                });
                                                        })
                                                }
                                        }
                                })
                        },
			getData(currentPage = 1){
			        this.pagination.currentPage = currentPage;
			        this.$http({
                                        url: '/staff/list',
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
//		        离职
		        dimissionHandler(staff){
			        this.$confirm(`确定让员工："${ staff.stf_name}" 离职吗？`, '警告',{ type:'warning',showClose:false})
				        .then(()=>this.$http({ url:`/staff/dimission/${staff.stf_id}`,method:'get'}))
				        .then(() =>{
			                        var i = this.list.findIndex(item =>item.stf_id === staff.stf_id);
			                        this.list[i].stf_invalid = 0;
			                        this.$message({message:`员工 "${staff.stf_name}"离职成功`,type:'success'})
				        }).catch(()=>{})
		        },
//		        入职
                        reinstateHandler(staff){
                                this.$confirm(`确定让员工："${ staff.stf_name}" 入职吗？`, '警告',{ type:'warning',showClose:false})
                                        .then(()=>this.$http({ url:`/staff/reinstate/${staff.stf_id}`,method:'get'}))
                                        .then(() =>{
                                                var i = this.list.findIndex(item =>item.stf_id === staff.stf_id);
                                                this.list[i].stf_invalid = 1;
                                                this.$message({message:`员工 "${staff.stf_name}"入职成功`,type:'success'})
                                        }).catch(()=>{})
                        },

	        },
	        created(){
			this.getData();
	        },
                watch:{
                        'edit.isEdit':function(newValue,oldValie){
                                if(!newValue){
                                        this.$refs.editForm.resetFields();
                                }
                        },
                }

        };
</script>

<style scoped>
	.el-container { height: 100%;}
	.dimission { color: red;}
	.empty { color: #ccc}
	/*为了表格设置最大高度*/
	.el-main { position: relative}
	.el-main>.table-wrapper {
		box-sizing: border-box; position: absolute;
		width: 100%;height: 100%;
		top: 0; left:0;
		padding: 10px;
		overflow: hidden
	}
</style>