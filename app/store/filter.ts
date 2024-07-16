import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

type filterType = "error" | "success";

export interface Filter {
    _id: string;
    location: string[] | undefined | null;
    gender: string[] | undefined | null;
    ageMin: number | undefined | null;
    ageMax: number | undefined | null;
    isCat: boolean,
    isDog: boolean,
    isBird: boolean,
    isOther: boolean,
}

const initialState: Filter = {
    _id: "",
    location: [],
    gender: [],
    ageMin: 0,
    ageMax: 0,
    isCat: false,
    isDog: false,
    isBird: false,
    isOther: false,
};

const slice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        upldateFilter(filterState, { payload }: PayloadAction<Filter>) {
            filterState._id = payload._id;
            filterState.location = payload.location;
            filterState.gender = payload.gender;
            filterState.ageMin = payload.ageMin;
            filterState.ageMax = payload.ageMax;
            filterState.isCat = payload.isCat;
            filterState.isDog = payload.isDog;
            filterState.isBird = payload.isBird;
            filterState.isOther = payload.isOther;
        },
    },
});

export const getFilterState = createSelector(
    (state: RootState) => state.filter,
    (filterState) => filterState
);

export const { upldateFilter } = slice.actions;

export default slice.reducer;
