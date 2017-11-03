/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * Reducer enhancer which transforms the result of the original reducer into an
 * object tracking its own history (past, present, future).
 *
 * @param  {Function} reducer            Original reducer
 * @param  {?Object}  options            Optional options
 * @param  {?Array}   options.resetTypes Action types upon which to clear past
 * @return {Function}                    Enhanced reducer
 */
export default function dirtyingReducer( reducer, options = {} ) {
	let originalState;

	return ( state, action ) => {
		let nextState = reducer( state, action );

		// Reset at:
		//  - Initial state
		//  - Reset types
		const isReset = (
			state === undefined ||
			includes( options.resetTypes, action.type )
		);

		const nextIsDirty = ! isReset && originalState !== nextState;

		// Only revise state if changing.
		if ( nextIsDirty !== nextState.isDirty ) {
			// In case the original reducer returned the same reference and we
			// intend to mutate, create a shallow clone.
			if ( state === nextState ) {
				nextState = { ...nextState };
			}

			nextState.isDirty = nextIsDirty;
		}

		// Track original state against which dirty test compares reference
		if ( isReset ) {
			originalState = nextState;
		}

		return nextState;
	};
}
