import Viewport from "../components/Viewport";

import { useStore } from "../../store/useStore";

export default function ContentManager() {
    const activeFilter = useStore((state) => state.activeFilter);
    const filtersHistory = useStore((state) => state.filtersHistory);
    const schema = useStore((state) => state.schema);

    // console.log(filtersHistory);
    // Inject config
    if (activeFilter != null && schema != null) {
        const {
            component: Component,
            config,
            btn,
            metadata,
            call,
        } = activeFilter;

        const componentIndex =
            config.componentIndex != undefined
                ? config.componentIndex
                : useStore.getState().activeIndex;

        // Init config
        if (config.componentIndex == undefined) {
            config.componentIndex = componentIndex;

            config.info = btn.info;
            config.name = btn.name.charAt(0).toUpperCase() + btn.name.slice(1);
            config.api = `${btn.category}/${btn.name}`;
            call.type = btn.name;
            // config.tempState = {};
        }

        return (
            <Component
                key={activeFilter.id}
                config={config}
                color={btn.color}
                schema={schema[componentIndex]}
                metadata={metadata}
                call={call}
            />
        );
    }

    return <>{activeFilter != null ? activeFilter.component : <Viewport />}</>;
}
