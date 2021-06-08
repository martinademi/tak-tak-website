
import React from 'react'
import TextField from 'material-ui/TextField'
import Wrapper from '../../../hoc/wrapperHoc'
import { BASE_COLOR } from '../../../lib/envariables';

const AuthInput = (props) => (
    <Wrapper>
        {props.signup && props.signup == true ?
            <TextField
                type={props.type}
                id={props.id}
                name={props.name}
                floatingLabelText={props.label}
                onKeyDown={props.allowNumber ? (e) => props.allowNumber(e) : (e) => {}}
                floatingLabelFocusStyle={{ color: BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                inputStyle={{ marginTop: "1px", marginLeft: "0.5px" }}
                style={{ height: "60px" }}
                value={props.value}
                onChange={(e) => props.onChange(props.keyType, e)}
                underlineShow={false}
                margin="normal"
                autoComplete="off"

            /> :
            props.dynamic ?
                props.focusOut ?
                    <TextField
                        type={props.type}
                        id={props.id}
                        name={props.name}
                        onBlur={(e) => props.focusOut(props.value)}
                        onFocus={props.focusIn}
                        floatingLabelText={props.label}
                        onKeyDown={props.allowNumber ? (e) => props.allowNumber(e) : (e) => {}}
                        floatingLabelFocusStyle={{ color: "#00cec5", transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                        inputStyle={{ marginTop: "3px", marginLeft: "0.5px" }}
                        style={{ height: "60px" }}
                        underlineShow={false}
                        value={props.value}
                        onChange={(e) => props.onChange(e, props.dynamicValue)}
                        margin="normal"
                        autoComplete="off"
                    /> :
                    <TextField
                        type={props.type}
                        id={props.id}
                        name={props.name}
                        floatingLabelText={props.label}
                        onKeyDown={props.allowNumber ? (e) => props.allowNumber(e) : (e) => {}}
                        floatingLabelFocusStyle={{ color: "#00cec5", transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                        inputStyle={{ marginTop: "3px", marginLeft: "0.5px" }}
                        style={{ height: "60px" }}
                        underlineShow={false}
                        value={props.value}
                        onChange={(e) => props.onChange(e, props.dynamicValue)}
                        margin="normal"
                        autoComplete="off"
                    />
                :
                !props.otp ?
                    <TextField
                        type={props.type}
                        id={props.id}
                        name={props.name}
                        floatingLabelText={props.label}
                        onKeyDown={props.allowNumber ? (e) => props.allowNumber(e) : (e) => {}}
                        floatingLabelFocusStyle={{ color: BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                        inputStyle={{ marginTop: "3px", marginLeft: "0.5px" }}
                        style={{ height: "60px" }}
                        underlineShow={false}
                        value={props.value}
                        onChange={props.onChange}
                        margin="normal"
                        autoComplete="off"
                    />
                    :
                    <TextField
                        type={props.type}
                        id={props.id}
                        name={props.name}
                        floatingLabelText={props.label}
                        onKeyDown={props.allowNumber ? (e) => props.allowNumber(e) : (e) => {}}
                        floatingLabelFocusStyle={{ color: BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                        floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                        inputStyle={{ marginTop: "5px", marginLeft: "5px", fontSize: '18px', letterSpacing: '10px' }}
                        style={{ height: "60px", width: '100%' }}
                        underlineShow={false}
                        value={props.value}
                        onChange={props.onChange}
                        margin="normal"
                        autoComplete="off"
                        maxLength="6"
                        pattern={props.pattern}
                    />

        }
    </Wrapper>
)

export default AuthInput;