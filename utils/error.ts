import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const handleAxiosError = async (error: AxiosError): Promise<void> => {
  const { response, code, message: errorMessage } = error;

  if (!response) {
    // Network error or no response received
    if (code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else if (
      code === 'ERR_NETWORK' ||
      errorMessage?.includes('Network Error')
    ) {
      toast.error('Failed to establish network connection.');
    } else if (code === 'ECONNREFUSED') {
      toast.error('Unable to reach server. Please try again later.');
    } else if (code === 'ERR_INTERNET_DISCONNECTED') {
      toast.error('Internet connection lost. Please reconnect and try again.');
    } else {
      toast.error('Connection to server failed!');
    }
    return;
  }

  const status = response.status;
  const responseData = response.data as Record<string, unknown>;
  const message =
    (responseData?.message as string) ||
    (responseData?.error as string) ||
    error.message ||
    'An error occurred';

  // Server error
  if (status === 500) {
    toast.error('Server Error, try again later!');
    return;
  }

  // Not found
  if (status === 404) {
    toast.error('Resource not found.');
    return;
  }

  // Bad request
  if (status === 400) {
    toast.error(message);
    return;
  }

  // Validation or other errors
  if (Array.isArray(message)) {
    message.forEach((msg) => toast.error(msg));
  } else {
    toast.error(message);
  }
};

export const onError = (error: AxiosError) => handleAxiosError(error);
