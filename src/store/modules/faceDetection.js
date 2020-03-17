//人脸检测API
import axios from "axios";

const state = {
  faceDetectionAnalyseData: '',
  faceDetectionResetDataStatus: false
}

const mutations = {
  SET_DATA:(state, data) => {
    state.faceDetectionAnalyseData = 'data:image/jpeg;base64,' + data
    console.log("ok...")
  },
  SET_DATA_STATUS:(state, data) => {
    state.faceDetectionResetDataStatus = data
  }
}

const actions = {
  /**
   * 上传分析图片
   * @param commit
   * @param data
   */
  faceDetectionAnalyseImg({commit}, data, obj) {
    axios.post('/api/face/detection', {"data" : data}).then(response => {
      let data = response.data
      commit("SET_DATA", data.data)
      commit("SET_DATA_STATUS", false)
    }).catch(error => {
      console.log(error)
      alert("分析失败")
    })
  },

  /**
   * 重置数据
   * @param state
   */
  faceDetectionResetData({state}) {
    state.faceDetectionAnalyseData = ''
    state.faceDetectionResetDataStatus = false
  },

  /**
   * 更改数据状态
   * @param commit
   * @param status
   */
  faceDetectionAnalyseSetStatus({commit}, status) {
    commit("SET_DATA_STATUS", status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
