import { createModule } from 'redux-modules';
import { loop, Cmd, liftState } from 'redux-loop';
import axios from 'axios';

import nowPlayingSelector from './selector';

import { KEY } from '../constants';

const nowPlayingModule = createModule({
  name: 'nowPlaying',
  initialState: {},
  selector: nowPlayingSelector,
  composes: [ liftState ],
  transformations: {
    clearCurrentVideo(state, action) {
      return {
        ...state,
        currentVideo: null,
        comments: null,
        relatedVideos: null
      };
    },
    getComments(state, action) {
      const { payload: id } = action;
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${id}&part=snippet&key=${KEY}`;
      return loop(
        {
          ...state,
          isLoading: true
        },
        Cmd.run(
          axios.get,
          {
            args: [url],
            successActionCreator: nowPlayingModule.actions.setComments,
            failActionCreator: nowPlayingModule.actions.onCommentsFailure
          }
        )
      )
    },
    getCurrentVideo(state, action) {
      const { payload: id } = action;
      const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${id}&key=${KEY}`;
      return loop(
        {
          ...state,
          isLoading: true
        },
        Cmd.list([
          Cmd.run(
            axios.get,
            {
              args: [url],
              successActionCreator: nowPlayingModule.actions.setCurrentVideo,
              failActionCreator: nowPlayingModule.actions.onCurrentVideoFailure
            }
          ),
          Cmd.action(nowPlayingModule.actions.getComments(id)),
          Cmd.action(nowPlayingModule.actions.getRelatedVideos(id))
        ])
      );
    },
    getRelatedVideos(state, action) {
      const { payload: id } = action;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=${id}&maxResults=20&key=${KEY}`;
      return loop(
        {
          ...state,
          isLoading: true
        },
        Cmd.run(
          axios.get,
          {
            args: [url],
            successActionCreator: nowPlayingModule.actions.onRelatedVideosSuccess,
            failActionCreator: nowPlayingModule.actions.onRelatedVideosFailure
          }
        )
      )
    },
    getRelatedVideoMetadata(state, action) {
      const videoIds = state.relatedVideos.items.map(item => item.id.videoId);
      const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(',')}&key=${KEY}`;
      return loop(
        {
          ...state,
          isLoading: true
        },
        Cmd.run(
          axios.get,
          {
            args: [url],
            successActionCreator: nowPlayingModule.actions.setRelatedVideoMetadata,
            failActionCreator: nowPlayingModule.actions.onRelatedVideoMetadataFailure
          }
        )
      );
    },
    onCommentsFailure(state, action) {
      const { payload: error } = action;
      return {
        ...state,
        isLoading: false,
        error
      };
    },
    onRelatedVideosFailure(state, action) {
      const { payload: error } = action;
      return {
        ...state,
        isLoading: false,
        error
      };
    },
    onRelatedVideosMetadataFailure(state, action) {
      const { payload: error } = action;
      return {
        ...state,
        isLoading: false,
        error
      };
    },
    onRelatedVideosSuccess(state, action) {
      const { payload: { data: relatedVideos } } = action;
      return loop(
        {
          ...state,
          isLoading: false,
          relatedVideos
        },
        Cmd.action(nowPlayingModule.actions.getRelatedVideoMetadata())
      );
    },
    setCurrentVideo(state, action) {
      const { payload: { data: currentVideo } } = action;
      return {
        ...state,
        currentVideo
      };
    },
    setComments(state, action) {
      const { payload: { data: comments } } = action;
      return {
        ...state,
        isLoading: false,
        comments
      };
    },
    setRelatedVideoMetadata(state, action) {
      const { payload: { data: relatedVideoMetadata } } = action;
      return {
        ...state,
        isLoading: false,
        relatedVideoMetadata
      };
    }
  }
});

export default nowPlayingModule;
