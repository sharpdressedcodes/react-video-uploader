import { configureStore } from '@reduxjs/toolkit';
import uploaderReducer from '../reducers/uploader';
import videoReducer from '../reducers/video';
import loadVideosReducer from '../reducers/loadVideos';

export default function configureAppStore(preloadedState/* = null */) {
    const store = configureStore({
        preloadedState,
        reducer: {
            uploaderReducer,
            videoReducer,
            loadVideosReducer
        }
    });

    // if (process.env.NODE_ENV !== 'production' && module.hot) {
    //     module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
    // }

    return store;
}
