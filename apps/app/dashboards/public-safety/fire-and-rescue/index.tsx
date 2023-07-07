import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
  StateDropdown,
} from "@components/index";
import { BOMBAIcon } from "@components/Icon/agency";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Trans } from "next-i18next";

/**
 * FireandRescue Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface FireandRescueProps {
  choropleth: any;
  last_updated: string;
  params: { state: string };
  timeseries: any;
  timeseries_callout: any;
}

const FireandRescue: FunctionComponent<FireandRescueProps> = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-fire-and-rescue", "common"]);
  const currentState = params.state;
  const FILTER_OPTIONS: Array<OptionType> = ["fire", "others", "overall", "rescue"].map(
    (key: string) => ({
      label: t(key),
      value: key,
    })
  );
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
    filter: FILTER_OPTIONS[0],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const OPERATION = ["fire", "rescue", "others"];
  const topStateIndices = getTopIndices(
    choropleth.data[data.filter.value].y.value,
    choropleth.data[data.filter.value].y.length,
    true
  );

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.public_safety"), "text-danger"]}
        header={[t("header")]}
        description={
          <Trans>
            <p className={"text-dim whitespace-pre-line xl:w-2/3"}>{t("description")}</p>
          </Trans>
        }
        action={<StateDropdown url={routes.FIRE_RESCUE} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:bomba.full")}
            link="https://www.bomba.gov.my/"
            icon={<BOMBAIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* How are fire and rescue operations trending? */}
        <Section title={t("operation_header")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("timeseries_title", {
                    state: CountryAndStates[currentState],
                  })}
                  enableAnimation={!play}
                  interval="auto"
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.overall,
                        label: t("daily"),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("daily"),
                      value: `+${numFormat(
                        timeseries_callout.data.data[currentState].overall.daily.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("total"),
                      value: numFormat(
                        timeseries_callout.data.data[currentState].overall.cumul.value,
                        "standard"
                      ),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {OPERATION.map((key: string) => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval="auto"
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t("daily"),
                            borderColor: AKSARA_COLOR.DANGER,
                            borderWidth: 1.5,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: true,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("daily"),
                          value: `+${numFormat(
                            timeseries_callout.data.data[currentState][key].daily.value,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("total"),
                          value: numFormat(
                            timeseries_callout.data.data[currentState][key].cumul.value,
                            "standard"
                          ),
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>

        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    width="w-full lg:w-fit"
                    placeholder={t("common:common.select")}
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                    onChange={e => setData("filter", e)}
                  />
                  <p className="text-dim whitespace-pre-line">{t("choro_description")}</p>
                  <p className="border-outline dark:border-washed-dark border-t pb-3 pt-6 font-bold">
                    {t("choro_ranking")}
                  </p>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topStateIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">
                          {CountryAndStates[choropleth.data[data.filter.value].x[pos]]}
                        </div>
                        <div className="text-danger font-bold">
                          {`${numFormat(
                            choropleth.data[data.filter.value].y.value[pos],
                            "standard"
                          )}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="reds"
                data={{
                  labels: choropleth.data[data.filter.value].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter.value].y.value,
                }}
                type="state"
              />
            }
          ></LeftRightCard>
        </Section>
      </Container>
    </>
  );
};

export default FireandRescue;
