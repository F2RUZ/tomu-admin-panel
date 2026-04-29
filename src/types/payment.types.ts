// src/types/payment.types.ts

export interface CoursePayment {
  id: number;
  fullName: string;
  courseName: string;
  paymentAmount: string | number;
  userPhoneNumber: string;
  gender: string;
  courseId: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface LiveChatPayment {
  id: number;
  fullName: string;
  courseName: string;
  paymentAmount: string | number;
  userPhoneNumber: string;
  duration: number;
  selectedDay: string;
  selectedTime: string;
  gender: string;
  liveChatId: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CoursePaymentListResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
    data: CoursePayment[];
    total_page: number;
  };
}

export interface LiveChatPaymentListResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
    data: LiveChatPayment[];
    total_page: number;
  };
}
