import APIUtils from '../../../legacy/utils/APIUtils';

const ConversationsAPI = {

  getList(queryParams = '') {
    return APIUtils.get(`Surveys?${queryParams}`);
  },

  getSingle(id = null) {
    if (!id) {
      throw new Error('Cannot load Survey without ID');
    }
    return APIUtils.get(`Surveys/${id}`);
  },

  create(survey) {
    return APIUtils.post('Surveys', survey);
  },

  update(survey, id = null) {
    const surveyId = id || survey.id;
    if (!surveyId) {
      throw new Error('Cannot update Survey without ID');
    }
    return APIUtils.put(`Surveys/${surveyId}`, survey);
  },

  activate(id = null) {
    if (!id) {
      throw new Error('Cannot activate Survey without ID');
    }
    return APIUtils.post(`Surveys/${id}/activate`);
  },

  delete(id) {
    return APIUtils.del(`Surveys/${id}`);
  },

  pushToPanel(id, payLoad = {}) {
    return APIUtils.post(`Surveys/${id}/push-to-panel`, { ...payLoad });
  },
};

export default ConversationsAPI;
