import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/demography/birthday-explorer";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayExplorer = ({ timeseries }: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-birthday-explorer", "common"]);
  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.birthday_explorer")}
        description={t("dashboard-birthday-explorer:description")}
        keywords={""}
      />
      <BirthdayExplorerDashboard timeseries={timeseries} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-birthday-explorer", "common"]);
  const { data } = await get("/explorer", { explorer: "BIRTHDAY_POPULARITY", state: "mys" });
  return {
    props: {
      ...i18n,
      timeseries: {
        data: {
          x: data.x,
          y: data.y,
        },
      },
    },
  };
};

export default BirthdayExplorer;
