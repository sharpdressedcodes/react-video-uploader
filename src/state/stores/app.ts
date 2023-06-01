import { configureStore, PreloadedState, StateFromReducersMapObject } from '@reduxjs/toolkit';
import uploaderReducer from '../reducers/uploader';
import videoReducer from '../reducers/video';
import loadVideosReducer from '../reducers/loadVideos';

const reducer = {
    uploaderReducer,
    videoReducer,
    loadVideosReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducer>;

const configureAppStore = (preloadedState?: PreloadedState<RootState>) => {
    const store = configureStore({
        preloadedState,
        reducer,
    });

    // if (process.env.NODE_ENV !== 'production' && module.hot) {
    //     module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
    // }

    return store;
};

export type StoreType = ReturnType<typeof configureAppStore>;
// type RootState__ = ReturnType<Store['getState']> //alternate way
export type AppDispatch = StoreType['dispatch'];

export default configureAppStore;
