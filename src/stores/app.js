// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { composeWithDevTools } from '@redux-devtools/extension';
// import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import uploaderReducer from '../reducers/uploader';
import videoReducer from '../reducers/video';
import loadVideosReducer from '../reducers/loadVideos';

// export default function store(preloadedState = null) {
//     // const reducers = combineReducers({
//     //     uploaderReducer,
//     //     videoReducer,
//     //     loadVideosReducer
//     // });
//     // const middlewares = [thunk];
//     // const middlewareEnhancer = applyMiddleware(...middlewares);
//     // const enhancers = [middlewareEnhancer];
//     // const composedEnhancers = composeWithDevTools(...enhancers);
//     //
//     // if (preloadedState) {
//     //     return createStore(reducers, preloadedState, composedEnhancers);
//     // }
//     // return createStore(reducers, composedEnhancers);
// }
// const store = configureStore({
//     reducer: {
//         uploaderReducer,
//         videoReducer,
//         loadVideosReducer
//     }
// });
//
// export default store;
export default function configureAppStore(preloadedState/* = null*/) {
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
