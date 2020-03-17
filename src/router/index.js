import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import Default from '../views/home/default'
import FaceDetection from "./faceDetection";
import FaceSearch from "./faceSearch";
import FaceAuthe from './faceAuthe'
import FaceLogin from '../components/FaceIdentification/FaceLogin/index'
import PersonNumber from '../components/BodyIdentification/PersonNumber/index'
import GestureAnalyse from '../components/BodyIdentification/GestureAnalyse/index'
import User from "./user";
import Audio from '../components/Audio/index'
import CallHelp from '../components/Audio/CallHelp/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/default',
      children: [
        {
          path: 'default',
          name: 'default',
          component: Default
        },
        //人脸识别
        FaceDetection,
        //人脸搜索
        FaceSearch,
        FaceAuthe,
        //body
        {
          path: '/body/personNum',
          name: 'personNum',
          component: PersonNumber
        },
        {
          path: '/body',
          name: 'body',
          component: GestureAnalyse
        },
        {
          path: '/face',
          name: 'face',
          component: FaceLogin
        },
        {
          path: '/audio',
          name: 'audio',
          component: Audio
        },
        {
          path: '/audio/callhelp',
          name: 'callhelp',
          component: CallHelp
        }
      ]
    },
    //用户
    ...User
  ]
})
