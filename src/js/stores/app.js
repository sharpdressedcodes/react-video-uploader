import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import uploaderReducer from '../reducers/uploader';
import videoReducer from '../reducers/video';
import loadVideosReducer from '../reducers/loadVideos';

export function configureStore(preloadedState = null) {

    console.log('configureStore', preloadedState);

    const reducers = combineReducers({
        uploaderReducer,
        videoReducer,
        loadVideosReducer
    });
    const middlewares = [thunk];
    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers);

    // if (preloadedState) {
    //     return createStore(reducers, preloadedState, composedEnhancers);
    // } else {
    //     return createStore(reducers, composedEnhancers);
    // }

    if (preloadedState) {
        return createStore(reducers, preloadedState);
    } else {
        return createStore(reducers);
    }
}

// const AppStore = configureStore();
// export default AppStore;

const store = createStore(combineReducers({
    uploaderReducer,
    videoReducer,
    loadVideosReducer
}));
export default store;


