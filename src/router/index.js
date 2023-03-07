import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/home/Home';
import Student from "../sc/student/Student.vue";
import Teacher from "../sc/teacher/Teacher.vue";
import Classes from "../sc/BanjiClass/classes.vue"
import course from "../sc/Course/course.vue"
import score from "../sc/score/score.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/student',//跳转的地址
          name: 'Student',
          component:Student
      },
        {
          path: '/teacher',//跳转的地址
          name: 'teacher',
          component:Teacher
        },
        {
          path: '/classes',//跳转的地址
          name: 'classes',
          component:Classes
        },
        {
          path: '/course',//跳转的地址
          name: 'course',
          component:course
        },
        {
          path: '/score',//跳转的地址
          name: 'score',
          component:score
        },
      ]
    }
  ]
})
