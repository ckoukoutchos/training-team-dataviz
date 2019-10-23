import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS } from '../actionTypes';

interface MetadataState {
	cycleNameLookup: any;
}

const initalState = {
	cycleNameLookup: {}
};

const metadataReducer = (
  state: MetadataState = initalState,
  action: ActionTypes
): MetadataState => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS_SUCCESS:
      return {
        cycleNameLookup: action.cycleMetadata
      };
    default:
      return state;
  }
};

export default metadataReducer;
