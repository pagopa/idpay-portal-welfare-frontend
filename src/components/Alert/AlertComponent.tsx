import { Alert, AlertColor, AlertTitle, Box, Grow, SxProps, Theme } from '@mui/material';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { CheckCircleOutline, Sync } from '@mui/icons-material';

export type AlertComponentProps = {
    title?: string;
    text?: string;
    isOpen?: boolean;
    severity?: AlertColor;
    containerStyle?: SxProps<Theme>;
    contentStyle?: SxProps<Theme>;
    onClose?: () => void;
};

const severityMap = {
    error: { color: '#FE6666', icon: <ErrorOutline /> },
    warning: { color: undefined, icon: undefined },
    info: { color: '#6BCFFB', icon: <Sync /> }, // report processing state (INSERTED/IN_PROGRESS)
    success: { color: '#6CC66A', icon: <CheckCircleOutline /> }
};

const AlertComponent = ({ title, text, isOpen, severity, containerStyle, contentStyle, onClose }: AlertComponentProps) =>

    <Grow in={isOpen} mountOnEnter unmountOnExit>
        <Box sx={{
            display: 'flex',
            height: '100%',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: '128px',
            zIndex: '1300',
            ...containerStyle
        }}>
            <Alert
                onClose={onClose}
                data-testid="alert"
                severity={severity}
                icon={severity && severityMap[severity].icon}
                sx={{
                    position: 'absolute',
                    bottom: '-108px',
                    backgroundColor: 'white',
                    width: 'auto',
                    maxWidth: '400px',
                    minWidth: '300px',
                    zIndex: 1300,
                    boxShadow: 3,
                    borderRadius: 1,
                    '& .MuiAlert-icon': {
                        color: severity && severityMap[severity].color,
                    },
                    ...contentStyle,
                }}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {text}
            </Alert>
        </Box>
    </Grow>;
export default AlertComponent;