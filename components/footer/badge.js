import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
    root: {
        right: 5,
        top: 10,
        // top:'-5px',
        fontSize: '12px'
    },
    colorPrimary: {
        backgroundColor: '#ffab84'
    },
});

function SimpleBadge(props) {
    const { classes } = props;

    return (
        <div>

            <Badge
                classes={{
                    badge: classes.root,
                    colorPrimary: classes.colorPrimary
                }}

                badgeContent={props.count} color="primary">
                {props.children}
            </Badge>

        </div>
    );
}

SimpleBadge.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleBadge);