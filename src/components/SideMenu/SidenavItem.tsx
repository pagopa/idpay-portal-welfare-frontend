import { ListItemButton, ListItemText, ListItemIcon, Icon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  level: number;
};

export default function SidenavItem({ handleClick, title, isSelected, icon, level }: Props) {
  return (
    <ListItemButton selected={isSelected} onClick={handleClick}>
      <ListItemIcon sx={{ ml: level }}>
        <Icon component={icon} />
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
}
