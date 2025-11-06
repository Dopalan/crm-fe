import apiClient from ".";
import type { ApiResponse } from "../types";
import type { Note } from "../types/note";

const CUSTOMER_NOTES_URL = "customers";

export const addCustomerNote = async (
  customerId: number,
  content: string
): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<any>>(
      `${CUSTOMER_NOTES_URL}/${customerId}/notes`,
      { content }
    );
  } catch (error) {
    console.error(`Lỗi khi thêm note cho khách hàng ${customerId}:`, error);
    throw new Error('Không thể thêm ghi chú.');
  }
};

export const getCustomerNotes = async (
  customerId: number
): Promise<Note[]> => { 
    try {
        const response = await apiClient.get<ApiResponse<any>>(
            `${CUSTOMER_NOTES_URL}/${customerId}/notes`
        );
    
        const notesData = response.data.data?.data || [];
        
        console.log('📝 Notes data:', notesData);
        
        return notesData.map((note: any) => ({
            id: String(note.id),
            content: note.content,
            authorName: note.authorName,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        }));
    } catch (error) {
        console.error(`Lỗi khi fetch notes của khách hàng ${customerId}:`, error);
        throw new Error('Không thể tải ghi chú của khách hàng.');
    }
};

export const deleteCustomerNote = async (
  customerId: number,
  noteId: string | number
): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<any>>(
      `${CUSTOMER_NOTES_URL}/${customerId}/notes/${noteId}`
    );
  } catch (error) {
    console.error(`Lỗi khi xóa note ${noteId} của khách hàng ${customerId}:`, error);
    throw new Error('Không thể xóa ghi chú.');
  }
};

export const updateCustomerNote = async (
  customerId: number,
  noteId: string | number,
  content: string
): Promise<void> => {
  try {
    await apiClient.put<ApiResponse<any>>(
      `${CUSTOMER_NOTES_URL}/${customerId}/notes/${noteId}`,
      { content }
    );
  } catch (error) {
    console.error(`Lỗi khi cập nhật note ${noteId} của khách hàng ${customerId}:`, error);
    throw new Error('Không thể cập nhật ghi chú.');
  }
};
