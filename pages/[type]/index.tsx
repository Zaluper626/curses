import {GetStaticPaths, GetStaticProps, GetStaticPropsContext} from "next";
import React from "react";
import axios from "axios";
import { withLayout } from "../../layout/Layout";
import { MenuItem } from "../../interfaces/menu.interface";
import { firstLevelMenu } from "../../helpers/helpers";
import { ParsedUrlQuery } from "node:querystring";
import { API } from "../../helpers/api";
import {Htag} from "../../components";
import styles from "../../styles/home.module.css";
import Category from "../../components/Category/Category";

function Type({ menu }: TypeProps): JSX.Element {

    return (
        <>
            <Htag className={styles.title} tag='h1'>Лучшие курсы онлайн.</Htag>
            <ul className={styles.courses}>
                {menu.map(i => <Category key={i._id.secondCategory} category={i}/>)}
            </ul>
        </>
    );
}

export default withLayout(Type);

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: firstLevelMenu.map(m => '/' + m.route),
        fallback: true
    };
};

export const getStaticProps: GetStaticProps<TypeProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
    if (!params) {
        return {
            notFound: true
        };
    }

    const firstCategoryItem = firstLevelMenu.find(m => m.route === params.type);

    if (!firstCategoryItem) {
        return {
            notFound: true
        };
    }

    const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
        firstCategory: firstCategoryItem.id
    });

    return {
        props: {
            menu,
            firstCategory: firstCategoryItem.id
        }
    };
};

interface TypeProps extends Record<string, unknown> {
    menu: MenuItem[];
    firstCategory: unknown;
}
