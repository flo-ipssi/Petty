import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserProfile {
   id: string;
   name: string;
   email: string;
   verified: boolean;
   avatar: string | undefined;
   description: string | undefined;
   followers: number;
   followings: number;
}

interface AuthState {
   profile: UserProfile | null;
   loggedIn: boolean;
   busy: boolean;
}

const initialState: AuthState = {
   profile: null,
   loggedIn: false,
   busy: false,
};

const slice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      updateProfile(authState, { payload }: PayloadAction<UserProfile | null>) {
         authState.profile = payload;
      },
      updateLoggedInState(authState, { payload }) {
         authState.loggedIn = payload;
      },
      updateBusyState(authState, { payload }: PayloadAction<boolean>) {
         authState.busy = payload;
      },
      updateName(authState, { payload }: PayloadAction<string | undefined>) {
         if (authState.profile && payload !== undefined) {
            authState.profile.name = payload;
         }
      },
      updateDescription(
         authState,
         { payload }: PayloadAction<string | undefined>
      ) {
         if (authState.profile && payload !== undefined) {
            authState.profile.description = payload;
         }
      },
   },
});

export const {
   updateLoggedInState,
   updateProfile,
   updateBusyState,
   updateDescription,
   updateName,
} = slice.actions;

export const getAuthState = createSelector(
   (state: RootState) => state,
   ({ auth }) => auth
);
export default slice.reducer;
