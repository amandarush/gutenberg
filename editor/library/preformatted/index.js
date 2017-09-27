/**
 * WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import { registerBlockType, createBlock, source } from '../../api';
import Editable from '../../editable';
import InspectorControls from '../../inspector-controls';
import BlockDescription from '../../block-description';

const { children } = source;

registerBlockType( 'core/preformatted', {
	title: __( 'Preformatted' ),

	icon: 'text',

	category: 'formatting',

	attributes: {
		content: {
			type: 'array',
			source: children( 'pre' ),
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( attributes ) =>
					createBlock( 'core/preformatted', attributes ),
			},
			{
				type: 'raw',
				isMatch: ( node ) => (
					node.nodeName === 'PRE' &&
					! (
						node.children.length === 1 &&
						node.firstChild.nodeName === 'CODE'
					)
				),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( attributes ) =>
					createBlock( 'core/paragraph', attributes ),
			},
		],
	},

	edit( { attributes, setAttributes, focus, setFocus, className } ) {
		const { content } = attributes;

		return [
			focus && (
				<InspectorControls key="inspector">
					<BlockDescription>
						<p>{ __( 'Preformatted text keeps your spaces, tabs and linebreaks as they are.' ) }</p>
					</BlockDescription>
				</InspectorControls>
			),
			<Editable
				key="block"
				tagName="pre"
				value={ content }
				onChange={ ( nextContent ) => {
					setAttributes( {
						content: nextContent,
					} );
				} }
				focus={ focus }
				onFocus={ setFocus }
				placeholder={ __( 'Write preformatted text…' ) }
				wrapperClassname={ className }
			/>,
		];
	},

	save( { attributes } ) {
		const { content } = attributes;

		return <pre>{ content }</pre>;
	},
} );