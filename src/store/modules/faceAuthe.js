//人脸检测API
import axios from "axios";

const state = {
  user: ''
}

const mutations = {
  SET_DATA:(state, data) => {
    state.user = data
  }
}

const actions = {
  /**
   * 身份验证
   * @param commit
   * @param data
   */
  doFaceAuthe({commit}, data) {
      axios.post('/api/face/authe', {"data" : data}).then(response => {
        let data = response.data
        commit("SET_DATA", data.data)
      }).catch(error => {
        console.log(error)
        alert("分析失败")
      })
  },

  resetData({state}){
    state.user = ''
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
