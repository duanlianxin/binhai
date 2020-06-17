import Vue from 'vue';
import Vuex from 'vuex';
import func from './func';
import http from '../until/http';
import dictionary from './dictionary';
import classroom from './classroom';
import role from './role';

Vue.use(Vuex);

export default new Vuex.Store({
        state: { http },
        mutations: {},
        actions: {},
        modules: { func,dictionary,classroom,role }
})
