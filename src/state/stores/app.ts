import { combineReducers, configureStore, StateFromReducersMapObject } from '@reduxjs/toolkit';
import uploaderReducer from '../reducers/uploader';
import videoReducer from '../reducers/video';
import loadVideosReducer from '../reducers/loadVideos';

const reducer = combineReducers({
    uploader: uploaderReducer,
    video: videoReducer,
    loadVideos: loadVideosReducer,
});

export type RootState = StateFromReducersMapObject<typeof reducer>;

const configureAppStore = (preloadedState?: Partial<RootState>) => {
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
export type AppDispatch = StoreType['dispatch'];

export default configureAppStore;
