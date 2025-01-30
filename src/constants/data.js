import axiosInstance from './httpServices';

const apiEndpoints = {
    levels: `${axiosInstance.defaults.baseURL}api/levels/`,
    courses: `${axiosInstance.defaults.baseURL}api/courses/`,
    classes: `${axiosInstance.defaults.baseURL}api/classes/`,
    lessons: `${axiosInstance.defaults.baseURL}api/lessons/`,
    exams: `${axiosInstance.defaults.baseURL}api/exams/`,
    notes: `${axiosInstance.defaults.baseURL}api/notes/`,
    books: `${axiosInstance.defaults.baseURL}api/books/`,
    works: `${axiosInstance.defaults.baseURL}api/works/`,
    schemes_of_work: `${axiosInstance.defaults.baseURL}api/schemes_of_work/`,
    lesson_plans: `${axiosInstance.defaults.baseURL}api/lesson_plans/`,
    logout: `${axiosInstance.defaults.baseURL}api/logout/`,
    profile: `${axiosInstance.defaults.baseURL}api/profile/`,
    password_reset: `${axiosInstance.defaults.baseURL}api/password-reset/`,
    password_reset_confirm: `${axiosInstance.defaults.baseURL}api/password-reset-confirm/`,
    download_payment: `${axiosInstance.defaults.baseURL}api/download-payment/`,
    download_history: `${axiosInstance.defaults.baseURL}api/download-history/`,
    make_payment: `${axiosInstance.defaults.baseURL}api/make_payment/`,
    payment_all: `${axiosInstance.defaults.baseURL}api/payment/all/`,
    current_subscription: `${axiosInstance.defaults.baseURL}api/current-subscription/`,
    view_pdf_page: (type, id, page) => `${axiosInstance.defaults.baseURL}api/${type}/${id}/view_pdf_page/?page=${page}`,
    download_pdf: (type, id) => `${axiosInstance.defaults.baseURL}api/${type}/${id}/download_pdf/`,
};

const apiService = {
    getAll: async (endpoint) => {
        try {
            const response = await axiosInstance.get(apiEndpoints[endpoint]);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },

    getOne: async (endpoint, id) => {
        try {
            const response = await axiosInstance.get(`${apiEndpoints[endpoint]}${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} with id ${id}:`, error);
            throw error;
        }
    },

    create: async (endpoint, data) => {
        console.log(`Creating ${endpoint + '/'}`, data);
        try {
            console.log(`=======>Creating ${endpoint + '/'}`, data);
            const response = await axiosInstance.post(apiEndpoints[endpoint], data);
            return response.data;
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error);
            throw error;
        }
    },

    update: async (endpoint, id = '', data) => {
        try {
            const url = id ? `${apiEndpoints[endpoint]}${id}/` : apiEndpoints[endpoint];
            const response = await axiosInstance.put(url, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating ${endpoint}${id ? ` with id ${id}` : ''}:`, error);
            throw error;
        }
    },

    partialUpdate: async (endpoint, id, data) => {
        try {
            const response = await axiosInstance.patch(`${apiEndpoints[endpoint]}${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error partially updating ${endpoint} with id ${id}:`, error);
            throw error;
        }
    },

    delete: async (endpoint, id) => {
        try {
            const response = await axiosInstance.delete(`${apiEndpoints[endpoint]}${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ${endpoint} with id ${id}:`, error);
            throw error;
        }
    },

    viewPdfPage: async (type, id, page) => {
        try {
            const response = await axiosInstance.get(apiEndpoints.view_pdf_page(type, id, page), { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.error(`Error viewing PDF page for ${type} with id ${id}:`, error);
            throw error;
        }
    },

    downloadPdf: async (type, id) => {
        try {
            const response = await axiosInstance.get(apiEndpoints.download_pdf(type, id), { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.error(`Error downloading PDF for ${type} with id ${id}:`, error);
            throw error;
        }
    },

    makePaymentRequest: async (data) => {
        try {
          const response = await axiosInstance.post(apiEndpoints.make_payment, data);
          return response.data;
        } catch (error) {
          console.error(`Error making payment:`, error);
          throw error;
        }
      },
    
      // Receive payment confirmation
      receivePayment: async (data) => {
        try {
          const response = await axiosInstance.post(apiEndpoints.payment_all, data);
          return response.data;
        } catch (error) {
          console.error(`Error receiving payment confirmation:`, error);
          throw error;
        }
      },
    };
    

export default apiService;