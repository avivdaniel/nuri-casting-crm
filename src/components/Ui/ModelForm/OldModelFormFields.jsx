import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { Controller, useFormContext } from "react-hook-form";

import {
  AGENCY_OPTIONS,
  BANKS_OPTIONS,
  COVID_STATUS,
  GENDER_OPTIONS,
  SHIRT_SIZE_OPTIONS,
} from "./constants";
import { CustomSelect, CustomCreatableSelect } from "../Select";
import { getBankBranches } from "../../../services";
import { PageHero } from "../index";
import { iconsNames } from "../CardGroups/consts";

const controlStylesHasError = (hasError) =>
  hasError
    ? { background: "#fff6f6", borderColor: "#e0b4b4", color: "#9f3a38" }
    : {};

const ModelFormFields = ({ onSubmit, backLink, isLoading, modelId = null }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const watchBankNumber = watch("bank-bank_number", false);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loadBranchOptions, setLoadBranchOptions] = useState(false);

  const handleGetBranchesOptions = () => {
    if (!watchBankNumber) return;
    setLoadBranchOptions(true);
    getBankBranches({
      bankNumber: watchBankNumber,
    })
      .then((res) => setBranchOptions(res))
      .finally(() => setLoadBranchOptions(false));
  };

  useEffect(() => {
    handleGetBranchesOptions();
  }, [watchBankNumber]);

  return (
    <>
      {!modelId && (
        <PageHero header="צור מיוצג חדש" icon={iconsNames.add_model} />
      )}
      <Segment loading={isLoading}>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Header textAlign="right">פרטים אישיים:</Header>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>שם + שם משפחה</label>
              <Controller
                control={control}
                rules={{ required: "שם מלא הוא שדה חובה" }}
                name="name"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    {...(errors?.name && {
                      error: { content: errors.name.message },
                    })}
                    placeholder="שם פרטי ושם משפחה"
                    onBlur={(e) => setValue("name", e.target.value.trimStart())}
                  />
                )}
              />
            </Form.Field>
            <Form.Field required error={!!errors?.idNumber}>
              <label>ת"ז (או דרכון במידה ואין ת״ז ישראלית)</label>
              <Controller
                control={control}
                rules={{
                  required: "תעודת זהות הוא שדה חובה",
                }}
                name="idNumber"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    {...(errors?.idNumber && {
                      error: { content: errors.idNumber.message },
                    })}
                    maxLength="9"
                    type="text"
                    placeholder="תעודת זהות"
                  />
                )}
              />
            </Form.Field>
            <Form.Field required error={!!errors?.gender}>
              <label>מין</label>
              <Controller
                control={control}
                rules={{
                  required: "מין הוא שדה חובה",
                }}
                name="gender"
                render={({ field }) => (
                  <Form.Select
                    {...field}
                    onChange={(e, { value }) => field.onChange(value)} // Update the form state
                    value={field.value}
                    {...(errors?.gender && {
                      error: { content: errors.gender.message },
                    })}
                    options={GENDER_OPTIONS}
                  />
                )}
              />
            </Form.Field>
            <Form.Field required error={!!errors?.phone}>
              <label>טלפון</label>
              <Controller
                control={control}
                rules={{
                  required: "טלפון הוא שדה חובה",
                  validate: (val) => val !== "",
                  pattern: {
                    value: /^0\d([\d]{0,1})([-]{0,1})\d{7}$/,
                    message: "מספר טלפון לא תקין",
                  },
                }}
                name="phone"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    {...(errors?.phone && {
                      error: { content: errors.phone.message },
                    })}
                    maxLength="10"
                    type="text"
                    placeholder="טלפון"
                  />
                )}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths={3}>
            <Form.Field>
              <label> מספר ווצאפ (במידה והמספר שונה ממספר טלפון)</label>
              <Controller
                control={control}
                name="whatsapp"
                render={({ field }) => (
                  <Form.Input {...field} type="text" placeholder="ווצאפ" />
                )}
              />
            </Form.Field>
            <Form.Field required>
              <label>עיר מגורים</label>
              <Controller
                control={control}
                rules={{
                  required: "עיר מגורים הוא שדה חובה",
                }}
                name="city"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    onBlur={(e) => setValue("city", e.target.value.trimStart())}
                    {...(errors?.city && {
                      error: { content: errors.city.message },
                    })}
                    placeholder="עיר"
                  />
                )}
              />
            </Form.Field>
            {/*<FormField>*/}
            {/*    <label>תאריך לידה (dd/mm/yyyy)</label>*/}
            {/*    <Controller*/}
            {/*        control={control}*/}
            {/*        name="birthday"*/}
            {/*        render={({field}) => {*/}
            {/*            return <DatePicker*/}
            {/*                {...field}*/}
            {/*                dateFormat="dd/MM/yyyy"*/}
            {/*                withPortal*/}
            {/*                locale="he"*/}
            {/*                selected={field.value}*/}
            {/*                showYearDropdown*/}
            {/*                showMonthDropdown*/}
            {/*            />*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</FormField>*/}
          </Form.Group>
          <Header>מידות:</Header>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>גובה:</label>
              <Controller
                control={control}
                rules={{
                  required: "גובה הוא שדה חובה",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "גובה יכול להכיל מספרים בלבד, (למשל: 175)",
                  },
                  minLength: {
                    value: 3,
                    message: " שדה גובה מכיל 3 ספרות (למשל: 170)",
                  },
                  min: {
                    value: 120,
                    message: "שדה גובה לא יהיה נמוך מ120",
                  },
                  max: {
                    value: 220,
                    message: "שדה גובה לא יהיה גבוה מ220",
                  },
                }}
                name={"height"}
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    placeholder="גובה"
                    maxLength={3}
                    {...(errors?.height && {
                      error: { content: errors.height.message },
                    })}
                  />
                )}
              />
            </Form.Field>
            <Form.Field required error={!!errors?.shirtSize}>
              <label>חולצה:</label>
              <select
                {...register("shirtSize", {
                  required: "חולצה הוא שדה חובה",
                })}
              >
                <option value="" disabled>
                  מידת חולצה
                </option>
                {SHIRT_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </Form.Field>
            <Form.Field required>
              <label>מכנסיים:</label>
              <Controller
                control={control}
                name="pantsSize"
                rules={{
                  required: "מידת מכנסיים הוא שדה חובה",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "מכנסיים הוא שדה מספרים בלבד",
                  },
                  minLength: {
                    value: 2,
                    message: "שדה מכנסיים מכיל 2 ספרות בלבד",
                  },
                }}
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    placeholder="מידת מכנסיים"
                    maxLength={2}
                    {...(errors?.pantsSize && {
                      error: { content: errors.pantsSize.message },
                    })}
                  />
                )}
              />
            </Form.Field>
            <Form.Field required>
              <label>נעליים:</label>
              <Controller
                control={control}
                name="shoeSize"
                rules={{
                  required: "מידת נעליים הוא שדה חובה",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "נעליים הוא שדה מספרים בלבד",
                  },
                  min: {
                    value: 20,
                    message: "ערך מידת נעליים מעל 20",
                  },
                  max: {
                    value: 70,
                    message: "ערך מידת נעליים מתחת ל70",
                  },
                  minLength: {
                    value: 2,
                    message: "שדה נעליים מכיל 2 ספרות בלבד",
                  },
                }}
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    maxLength={2}
                    placeholder="מידת נעליים"
                    {...(errors?.shoeSize && {
                      error: { content: errors.shoeSize.message },
                    })}
                  />
                )}
              />
            </Form.Field>
          </Form.Group>
          <Header>כללי:</Header>
          <Form.Group widths="4">
            <Form.Field required error={!!errors?.agency}>
              <label>סוכנות</label>
              <select
                {...register("agency", {
                  required: "שם סוכנות שדה חובה",
                })}
              >
                <option value="">בחר סוכנות</option>
                {AGENCY_OPTIONS.filter((agency) => agency.isActive).map(
                  (option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </Form.Field>
            <Form.Field disabled error={!!errors?.covid}>
              <label>תו ירוק</label>
              <select {...register("covid")}>
                {COVID_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Form.Field>
          </Form.Group>
          <Header>פרטי חשבון בנק:</Header>
          <Form.Group widths="4">
            <Form.Field>
              <CustomSelect
                control={control}
                name="bank-bank_number"
                label="בנק"
                placeholder="מספר הבנק"
                options={BANKS_OPTIONS}
                {...(errors?.["bank-bank_number"] && {
                  error: { content: errors?.["bank-bank_number"].message },
                })}
              />
            </Form.Field>
            <Form.Field>
              <CustomCreatableSelect
                control={control}
                name="bank-branch_number"
                label="סניף"
                placeholder="סניף"
                isDisabled={!watchBankNumber}
                allowCreateWhileLoading={false}
                options={branchOptions}
                isLoading={loadBranchOptions}
                {...(errors?.["bank-branch_number"] && {
                  error: { content: errors?.["bank-branch_number"].message },
                })}
              />
            </Form.Field>
            <Form.Field>
              <label>מספר חשבון</label>
              <Controller
                control={control}
                name="bank-account_number"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    placeholder="הקלד מספר חשבון"
                    {...(errors?.["bank-account_number"] && {
                      error: {
                        content: errors?.["bank-account_number"].message,
                      },
                    })}
                  />
                )}
              />
            </Form.Field>
            <Form.Field>
              <label>שם המוטב</label>
              <Controller
                control={control}
                name="bank-account_owner"
                render={({ field }) => (
                  <Form.Input
                    {...field}
                    placeholder="הקלד את שם המוטב"
                    {...(errors?.["bank-account_owner"] && {
                      error: {
                        content: errors?.["bank-account_owner"].message,
                      },
                    })}
                  />
                )}
              />
            </Form.Field>
          </Form.Group>
          <Button
            centered="true"
            color="green"
            style={{ margin: 0 }}
            loading={isLoading}
            disabled={isLoading}
          >
            שמור
          </Button>
          {!modelId && (
            <Button disabled={isLoading} color="red" as={Link} to={backLink}>
              ביטול
            </Button>
          )}
        </Form>
      </Segment>
    </>
  );
};

export default ModelFormFields;
