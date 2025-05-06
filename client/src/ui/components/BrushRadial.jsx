import { useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Group } from "@visx/group";
import { Arc, Line } from "@visx/shape";
import { useDrag } from "@visx/drag";
import { RadialGradient } from "@visx/gradient";

import { polarToCartesian } from "../../utils.js";

const angleToRadians = (angle) => (angle * Math.PI) / 180;
const radiansToAngle = (rad) => ((rad * 180) / Math.PI + 360) % 360;

const angleFromPoint = (x, y) => {
    const angle = Math.atan2(y, x);
    return radiansToAngle(angle);
};

export default function BrushRadial({
    color = "#fefefe",
    radius = 100,
    innerRadius = 60,
    brushAngles = [0, 360],
    pivot,
}) {
    const theme = useTheme();
    const { chartS } = theme;

    return (
        <Group className="radial-brush">
            <RadialGradient
                id="radial-gradient"
                from={color}
                to={color}
                fromOpacity={0}
                toOpacity={0.8}
                cx="50%"
                cy="50%"
                r="100%"
            />
            <Arc
                startAngle={angleToRadians(brushAngles[0])}
                endAngle={angleToRadians(brushAngles[1])}
                innerRadius={innerRadius}
                outerRadius={radius}
                fill="url(#radial-gradient)"
            />
            {brushAngles[0] % 360 != 0 && brushAngles[1] % 360 != 0 && (
                <>
                    <Line
                        from={{ x: 0, y: 0 }}
                        to={polarToCartesian(pivot, radius)}
                        stroke={chartS.gridLineStyle.stroke}
                        strokeWidth={1}
                        strokeDasharray={chartS.gridLineStyle.strokeDasharray}
                    />

                    <Line
                        from={{ x: 0, y: 0 }}
                        to={polarToCartesian(brushAngles[0], radius)}
                        stroke={color}
                        strokeWidth={2}
                    />
                    <Line
                        from={{ x: 0, y: 0 }}
                        to={polarToCartesian(brushAngles[1], radius)}
                        stroke={color}
                        strokeWidth={2}
                    />
                </>
            )}
        </Group>
    );
}
