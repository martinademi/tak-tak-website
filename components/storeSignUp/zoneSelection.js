import React from "react";
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Wrapper from '../../hoc/wrapperHoc';
import FiberManualRecordSharp from '@material-ui/icons/FiberManualRecordOutlined';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const styles = theme => ({
    root: {
        width: '99%',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: '100px'
    },

    rootCheck: {
        color: '#aaa',
        '&$checked': {
            color: '#00cec5'
        }, height: '25px',
        width: '25px',
        fontSize: '24px',
        borderRadius: '25px',
        float: 'right',
        right: '0px !important'
    },

    label: {
        margin: '10px',
        padding: '0px',
        fontSize: '24px',
        letterSpacing: '0.3px',
        textTransform: 'capitalize'
    },

    labelHead: {
        padding: '0px 5px !important',
        fontSize: '13px',
        color: '#212121',
        height: '40px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        fontWeight: '600',
    },

    checked: {},
    radio: {
        height: '25px',
        width: '40px',
        fontSize: '20px'
    },
    radioColor: {
        color: "#ff9800"
    },
    formGroup: {
        padding: '0px 0px',
        width: "100%"

    },
    nested: {
        paddingLeft: '4px',
    },
    sizeIcon: {
        fontSize: 22,
        fontWeight: 300,
        marginRight: 10
    },
    sizeIconPlus: {
        fontSize: 23,
        fontWeight: 300,
        marginRight: 10
    },
    navList: {
        overflow: 'hidden',
        marginBottom: '10px',
        marginTop: '10px'
    }
});

class ZoneSelect extends React.Component {

    render() {

        const { classes } = this.props;
        return (
            <Wrapper>
                <FormControl component="fieldset" required error className={classes.formGroup}>

                        {this.props.categoryList.map((category, index) =>
                            <FormControlLabel
                                label={category.title}
                                key={"formContolZone" + index}
                                
                                control={

                                    <Checkbox
                                        classes={{
                                            root: classes.rootCheck,
                                            checked: classes.checked,
                                        }}
                                        value={category.title}
                                        icon={<FiberManualRecordSharp className={classes.sizeIconPlus} />}
                                        checkedIcon={<CheckCircle className={classes.sizeIcon} />}
                                        onChange={(e)=>this.props.handleChange(e,category)}
                                    />
                                }

                                classes={{
                                    root: classes.label,
                                }}
                            />
                        )}

                </FormControl>
            </Wrapper>
        )
    }
}

export default withStyles(styles)(ZoneSelect);