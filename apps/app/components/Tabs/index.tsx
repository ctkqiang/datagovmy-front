import { FunctionComponent, ReactElement, ReactNode, useMemo, useState } from "react";
import { Tab } from "@headlessui/react";
import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";

interface TabsProps {
  children: ReactNode;
  hidden?: boolean;
  className?: string;
  current?: number;
  state?: ReactNode;
  title?: ReactNode;
  menu?: ReactNode;
  controls?: ReactNode;
  onChange?: (index: number) => void;
}

interface PanelProps {
  name: string | ReactElement;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

interface ListProps {
  options: string[];
  icons?: Array<ReactNode>;
  className?: string;
  current: number;
  onChange: (index: number) => void;
}

const Panel: FunctionComponent<PanelProps> = ({ children, name }) => {
  return <>{children}</>;
};

const List: FunctionComponent<ListProps> = ({ options, current, onChange, icons }) => {
  return (
    <ul className="flex">
      {options.map((option, index) => (
        <li
          key={option}
          className={clx(
            "flex cursor-pointer self-center whitespace-nowrap rounded-full px-[10px] py-1 text-sm outline-none transition-colors",
            current === index
              ? "bg-outline dark:bg-washed-dark font-medium text-black dark:text-white"
              : "text-dim bg-transparent hover:text-black dark:hover:text-white"
          )}
          onClick={() => onChange(index)}
        >
          {icons && icons[index]}
          {option}
        </li>
      ))}
    </ul>
  );
};

const Tabs: FunctionComponent<TabsProps> & { Panel: typeof Panel; List: typeof List } = ({
  className = "flex justify-start gap-2",
  hidden,
  children,
  title,
  controls,
  current,
  state,
  menu,
  onChange = () => {},
}) => {
  const { t } = useTranslation();

  const _children = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div className={clx("flex flex-wrap items-baseline justify-between gap-4", className)}>
          <div>
            {title && typeof title === "string" ? (
              <span className="text-base font-bold">{title}</span>
            ) : (
              title
            )}
            {state && typeof state === "string" ? (
              <p className="text-dim pt-4 text-sm">
                {t("common:common.data_for", { state: CountryAndStates[state] })}
              </p>
            ) : (
              <>{state}</>
            )}
          </div>

          <Tab.List
            className={clx(
              "flex flex-wrap items-center justify-between gap-[10px] lg:items-start lg:justify-end",
              hidden && "hidden"
            )}
          >
            {controls}
            <div className="flex flex-grow flex-wrap">
              {_children.map(({ props: { name, icon } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    clx(
                      "group flex flex-row rounded-full px-[10px] py-1 text-sm outline-none transition-colors",
                      selected
                        ? "bg-outline dark:bg-washed-dark font-medium text-black dark:text-white"
                        : "text-dim bg-transparent hover:text-black dark:hover:text-white"
                    )
                  }
                >
                  {icon}
                  {name}
                </Tab>
              ))}
            </div>

            {menu && <div>{menu}</div>}
          </Tab.List>
        </div>

        <Tab.Panels className="w-full">
          {_children.map(({ props: { children } }, index) => (
            <Tab.Panel className="overflow-auto" key={index}>
              {children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

Tabs.Panel = Panel;
Tabs.List = List;

export { List };
export { Panel };
export default Tabs;
