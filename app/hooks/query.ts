import { UploadData } from "@/@types/upload";
import catchAsyncError from "@/api/catchError";
import client from "@/api/client";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { upldateNotification } from "@/store/notification";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";


const fetchLatestResidence = async (userId: string): Promise<UploadData[]> => {
  
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
  if (!token) return;

  const res = await fetch(
    client + `upload/residence`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Authorization': `Bearer ${token}` 
      },
    }
  );
  const data = await res.json();
  return data;
};

export const useFetchLatestResidence = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  let query = useQuery(["latest-uploads"], {
    queryFn: () => fetchLatestResidence(authState.profile.id),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({ message: errorMessage, type: "error" }));
    },
  });
  return query;
};


const fetchAvatar = async (userId: string): Promise<UploadData[]> => {
  const res = await fetch(
    client + `upload/latest?userId=${userId}&category=User`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Permet les requêtes depuis toutes les origines
      },
    }
  );
  const data = await res.json();
  return data;
};

export const useFetchAvatar = (userId: string) => {
  const dispatch = useDispatch();
  let query = useQuery(["latest-uploads"], {
    queryFn: () => fetchAvatar(userId),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({ message: errorMessage, type: "error" }));
    },
  });
  return query;
};


const fetchFilter = async (): Promise<UploadData[]> => {
  
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
  if (!token) return;

  const res = await fetch(
    client + `filter/pets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        'Authorization': `Bearer ${token}`
      },
    }
  );
  const data = await res.json();
  return data;
};

export const useFetchPetsByFilters = () => {
  const dispatch = useDispatch();
  let query = useQuery(["filters"], {
    queryFn: () => fetchFilter(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({ message: errorMessage, type: "error" }));
    },
  });
  return query;
};